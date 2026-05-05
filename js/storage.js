(function () {
  const KEY = "hyo-life-os-state-v1";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function defaultTargets() {
    return Object.fromEntries(
      window.LIFE_OS_SEED.habits.map((habit) => [habit.id, habit.target])
    );
  }

  function defaultGrandPlan() {
    return {
      northStar: window.LIFE_OS_SEED.profile.mission,
      tenYear: "법·AI·금융·제도권을 통합한 고유 포지션 구축",
      oneYear: "학업 마무리, AICPA/CFA/AI 기반, 안정적 현금흐름과 건강 루틴",
      quarter: "하나의 핵심 시험/기술 트랙을 끝까지 밀고 주간 산출물을 남긴다",
      month: "수면·공부·운동·기록을 앱에 남기고 목표 난이도를 조정한다",
      week: "오늘 TOP 3를 매일 완료 가능한 크기로 낮춘다",
      lastUpdatedAt: null
    };
  }

  function defaultStrategy() {
    return {
      woop: clone(window.LIFE_OS_SEED.woopDefault),
      lastMethodReviewAt: null,
      methodReviewCadenceDays: 30
    };
  }

  function createInitialState() {
    return {
      version: 2,
      createdAt: new Date().toISOString(),
      lastSavedAt: null,
      settings: {
        targets: defaultTargets(),
        oneQuestionJournal: false,
        morningFocusLock: true,
        goalReviewCadenceDays: 7,
        lastEncryptedBackupAt: null,
        lastPlainBackupAt: null
      },
      grandPlan: defaultGrandPlan(),
      strategy: defaultStrategy(),
      entries: {},
      reviews: [],
      goalUpdates: [],
      adjustments: []
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return createInitialState();
      const parsed = JSON.parse(raw);
      return {
        ...createInitialState(),
        ...parsed,
        settings: {
          ...createInitialState().settings,
          ...(parsed.settings || {}),
          targets: {
            ...defaultTargets(),
            ...((parsed.settings && parsed.settings.targets) || {})
          }
        },
        entries: parsed.entries || {},
        reviews: parsed.reviews || [],
        grandPlan: {
          ...defaultGrandPlan(),
          ...(parsed.grandPlan || {})
        },
        strategy: {
          ...defaultStrategy(),
          ...(parsed.strategy || {}),
          woop: {
            ...defaultStrategy().woop,
            ...((parsed.strategy && parsed.strategy.woop) || {})
          }
        },
        goalUpdates: parsed.goalUpdates || [],
        adjustments: parsed.adjustments || []
      };
    } catch (error) {
      console.warn("Life OS state load failed; starting fresh.", error);
      return createInitialState();
    }
  }

  function saveState(state) {
    state.lastSavedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function createEntry(dateKey) {
    return {
      date: dateKey,
      morning: {
        done: false,
        energy: 3,
        mode: "방어",
        pledge: ""
      },
      missions: clone(window.LIFE_OS_SEED.defaultMissions).map((mission) => ({
        ...mission,
        done: false
      })),
      habits: Object.fromEntries(
        window.LIFE_OS_SEED.habits.map((habit) => [
          habit.id,
          habit.type === "checkbox" ? false : 0
        ])
      ),
      buddhist: {
        greed: 0,
        anger: 0,
        delusion: 0,
        overheated: false,
        attachment: false
      },
      flow: {
        challenge: 3,
        skill: 3,
        oneThing: ""
      },
      journal: {
        forward: "",
        overheat: "",
        tomorrow: "",
        oneLine: ""
      }
    };
  }

  function normalizeEntry(entry) {
    const fresh = createEntry(entry.date || todayKey());
    const oldRiskTitle = ["돈·계약·공공", "리스크 하나 문서화"].join("");
    entry.morning = { ...fresh.morning, ...(entry.morning || {}) };
    entry.habits = { ...fresh.habits, ...(entry.habits || {}) };
    entry.buddhist = { ...fresh.buddhist, ...(entry.buddhist || {}) };
    entry.flow = { ...fresh.flow, ...(entry.flow || {}) };
    entry.journal = { ...fresh.journal, ...(entry.journal || {}) };
    if (!Array.isArray(entry.missions) || entry.missions.length !== 3) {
      entry.missions = fresh.missions;
    }
    entry.missions = entry.missions.map((mission) => ({
      ...mission,
      title:
        mission.title === oldRiskTitle || (mission.title || "").includes("지원")
          ? "현금흐름·계약·학습시간 운영조건 하나 문서화"
          : mission.title,
      ifAction:
        mission.ifAction === "오늘의 미확정 리스크를 한 줄로 적고 다음 확인 행동을 쓴다" ||
        (mission.ifAction || "").includes("혜택")
          ? "오늘의 미확정 조건을 한 줄로 적고 다음 확인 행동을 쓴다"
          : mission.ifAction
    }));
    return entry;
  }

  function getEntry(state, dateKey) {
    if (!state.entries[dateKey]) {
      state.entries[dateKey] = createEntry(dateKey);
      saveState(state);
    }
    state.entries[dateKey] = normalizeEntry(state.entries[dateKey]);
    return state.entries[dateKey];
  }

  function orderedEntries(state, days = 7) {
    return Object.values(state.entries)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  }

  window.LifeStorage = {
    todayKey,
    loadState,
    saveState,
    getEntry,
    orderedEntries,
    createInitialState
  };
})();
