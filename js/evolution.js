(function () {
  function habitCompletion(entry, habit, targets) {
    const value = entry.habits[habit.id];
    if (habit.type === "checkbox") return value ? 1 : 0;
    const target = targets[habit.id] || habit.target;
    if (!target) return 0;
    return Math.max(0, Math.min(1, Number(value || 0) / target));
  }

  function entryHasJournal(entry, oneQuestion) {
    if (oneQuestion) return Boolean((entry.journal.oneLine || "").trim());
    return ["forward", "overheat", "tomorrow"].some((key) =>
      Boolean((entry.journal[key] || "").trim())
    );
  }

  function dailyScore(entry, targets, oneQuestion) {
    const habits = window.LIFE_OS_SEED.habits;
    const coreHabits = habits.filter((habit) => window.LIFE_OS_SEED.coreHabitIds.includes(habit.id));
    const guardrailHabits = habits.filter((habit) =>
      window.LIFE_OS_SEED.guardrailHabitIds.includes(habit.id)
    );
    const coreAverage =
      coreHabits.reduce((sum, habit) => sum + habitCompletion(entry, habit, targets), 0) /
      Math.max(1, coreHabits.length);
    const guardrailAverage =
      guardrailHabits.reduce((sum, habit) => sum + habitCompletion(entry, habit, targets), 0) /
      Math.max(1, guardrailHabits.length);
    const missionAverage =
      entry.missions.filter((mission) => mission.done).length / Math.max(1, entry.missions.length);
    const journalScore = entryHasJournal(entry, oneQuestion) ? 1 : 0;
    const morningScore = entry.morning && entry.morning.done ? 1 : 0;
    const buddhistPenalty =
      (Number(entry.buddhist.greed) + Number(entry.buddhist.anger) + Number(entry.buddhist.delusion)) /
      9;
    const raw =
      coreAverage * 40 +
      guardrailAverage * 12 +
      missionAverage * 25 +
      journalScore * 13 +
      morningScore * 10 -
      buddhistPenalty * 10;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }

  function weeklyStats(entries, targets, oneQuestion) {
    const habits = window.LIFE_OS_SEED.habits;
    const stats = habits.map((habit) => {
      const completions = entries.map((entry) => habitCompletion(entry, habit, targets));
      const average = completions.length
        ? completions.reduce((sum, value) => sum + value, 0) / completions.length
        : 0;
      const lastThree = completions.slice(-3);
      return {
        id: habit.id,
        label: habit.label,
        average,
        lastThreeFailed: lastThree.length === 3 && lastThree.every((value) => value < 0.5)
      };
    });
    const scores = entries.map((entry) => dailyScore(entry, targets, oneQuestion));
    const journalMisses = entries
      .slice(-3)
      .filter((entry) => !entryHasJournal(entry, oneQuestion)).length;
    return {
      habits: stats,
      averageScore: scores.length
        ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
        : 0,
      journalMisses,
      days: entries.length
    };
  }

  function clampTarget(value, habit) {
    if (habit.type === "checkbox") return 1;
    const min = habit.min ?? 1;
    const max = habit.max ?? Number.POSITIVE_INFINITY;
    const step = habit.step || 1;
    const stepped = Math.round(value / step) * step;
    return Math.max(min, Math.min(max, stepped));
  }

  function runWeeklyReview(state) {
    const entries = window.LifeStorage.orderedEntries(state, 7);
    const now = new Date().toISOString();
    const targets = state.settings.targets;
    const stats = weeklyStats(entries, targets, state.settings.oneQuestionJournal);
    const changes = [];

    window.LIFE_OS_SEED.habits.forEach((habit) => {
      if (habit.type === "checkbox") return;
      const stat = stats.habits.find((item) => item.id === habit.id);
      const before = targets[habit.id] || habit.target;
      let after = before;
      let reason = "";

      if (stat && stat.lastThreeFailed) {
        after = clampTarget(before * 0.7, habit);
        reason = "3일 연속 실패: 목표를 낮춰 실행 가능성 회복";
      } else if (stat && stat.average >= 0.85 && entries.length >= 7) {
        after = clampTarget(before * 1.12, habit);
        reason = "7일 평균 85% 이상: 목표를 작게 상향";
      }

      if (after !== before) {
        targets[habit.id] = after;
        changes.push({
          type: "target",
          habit: habit.label,
          before,
          after,
          reason
        });
      }
    });

    if (stats.journalMisses >= 3 && !state.settings.oneQuestionJournal) {
      state.settings.oneQuestionJournal = true;
      changes.push({
        type: "journal",
        habit: "저널",
        before: "3문항",
        after: "1문항",
        reason: "최근 3일 저널 미작성: 진입 마찰 제거"
      });
    } else if (stats.journalMisses === 0 && state.settings.oneQuestionJournal && entries.length >= 7) {
      state.settings.oneQuestionJournal = false;
      changes.push({
        type: "journal",
        habit: "저널",
        before: "1문항",
        after: "3문항",
        reason: "저널 회복: 표준 질문으로 복귀"
      });
    }

    const review = {
      date: window.LifeStorage.todayKey(),
      createdAt: now,
      stats,
      changes
    };
    state.reviews.push(review);
    state.adjustments.push(...changes.map((change) => ({ ...change, createdAt: now })));
    window.LifeStorage.saveState(state);
    return review;
  }

  function warnings(entry, targets) {
    const messages = [];
    if ((Number(entry.habits.sleep) || 0) < Math.min(6, Number(targets.sleep || 7))) {
      messages.push("수면이 낮다. 오늘 투자·계약·큰 결정은 보류가 원칙이다.");
    }
    const poison =
      Number(entry.buddhist.greed) + Number(entry.buddhist.anger) + Number(entry.buddhist.delusion);
    if (poison >= 6 || entry.buddhist.overheated) {
      messages.push("탐·진·치 또는 과열 점수가 높다. 내일 미션은 공격보다 회복·정리로 전환한다.");
    }
    if (!entry.habits.risk) {
      messages.push("리스크 차단 체크가 비어 있다. 돈·계약·출국 판단은 문서화 후 처리한다.");
    }
    return messages;
  }

  window.LifeEvolution = {
    habitCompletion,
    dailyScore,
    weeklyStats,
    runWeeklyReview,
    warnings,
    entryHasJournal
  };
})();
