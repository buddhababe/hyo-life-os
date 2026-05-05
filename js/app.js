(function () {
  const state = window.LifeStorage.loadState();
  const today = window.LifeStorage.todayKey();
  const entry = window.LifeStorage.getEntry(state, today);

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function saveAndRender() {
    window.LifeStorage.saveState(state);
    renderScore();
    renderCoach();
    renderExport();
    renderSettings();
    renderTabAccess();
  }

  function showAuthOverlay(mode = "unlock") {
    const overlay = $("#authOverlay");
    overlay.hidden = false;
    document.body.classList.add("auth-locked");
    const hasLock = window.LifeAuth.hasLock();
    $("#authTitle").textContent = hasLock ? "앱 잠금 해제" : "앱 잠금 설정";
    $("#authDescription").textContent = hasLock
      ? "이 기기의 Life OS 데이터를 보려면 4자리 PIN을 입력한다."
      : "처음 사용하려면 이 기기용 4자리 PIN을 먼저 설정한다.";
    $("#authPrimaryBtn").textContent = hasLock ? "해제" : "PIN 설정";
    $("#authPassphrase").value = "";
    $("#authError").textContent = "";
    if (mode === "lock") {
      $("#authTitle").textContent = "잠금 완료";
    }
    setTimeout(() => $("#authPassphrase").focus(), 30);
  }

  function hideAuthOverlay() {
    $("#authOverlay").hidden = true;
    document.body.classList.remove("auth-locked");
  }

  function updateLockStatus() {
    const status = window.LifeAuth.hasLock()
      ? "앱 잠금 PIN이 설정되어 있다. 브라우저 세션이 끝나면 다시 PIN이 필요하다."
      : "앱 잠금 PIN이 꺼져 있다. 공개 URL로 쓸 계획이면 PIN을 설정하는 편이 낫다.";
    $("#lockStatus").textContent = status;
  }

  function formatDateTime(value) {
    if (!value) return "기록 없음";
    try {
      return new Date(value).toLocaleString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "기록 있음";
    }
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

  function goalReviewInfo() {
    const cadence = Number(state.settings.goalReviewCadenceDays || 7);
    if (!state.grandPlan.lastUpdatedAt) {
      return { due: true, days: null, label: "목표 업데이트 필요" };
    }
    const elapsed = Date.now() - new Date(state.grandPlan.lastUpdatedAt).getTime();
    const days = Math.max(0, Math.floor(elapsed / 86400000));
    return {
      due: days >= cadence,
      days,
      label: days >= cadence ? `${days}일 경과: 업데이트 필요` : `${days}일 경과: 유지`
    };
  }

  function clampTarget(value, habit) {
    if (habit.type === "checkbox") return 1;
    const min = habit.min ?? 1;
    const max = habit.max ?? Number.POSITIVE_INFINITY;
    const step = habit.step || 1;
    const stepped = Math.round(Number(value || 0) / step) * step;
    return Math.max(min, Math.min(max, stepped));
  }

  function activateTab(tabName) {
    $$(".tab").forEach((item) => item.classList.remove("is-active"));
    $$(".view").forEach((item) => item.classList.remove("is-active"));
    const tab = $(`.tab[data-tab="${tabName}"]`);
    const view = $(`#view-${tabName}`);
    if (tab && view) {
      tab.classList.add("is-active");
      view.classList.add("is-active");
    }
    renderExport();
    renderSettings();
  }

  function renderTabAccess() {
    const locked = state.settings.morningFocusLock && !entry.morning.done;
    const lockedTabs = new Set(["feedback", "grand", "saju"]);
    $$(".tab").forEach((tab) => {
      const isLocked = locked && lockedTabs.has(tab.dataset.tab);
      tab.disabled = isLocked;
      tab.classList.toggle("is-locked", isLocked);
      tab.title = isLocked ? "아침 60초 체크 후 열린다." : "";
    });
    const active = $(".tab.is-active");
    if (active && active.disabled) {
      activateTab("command");
    }
  }

  async function handleAuthPrimary() {
    const passphrase = $("#authPassphrase").value;
    try {
      if (window.LifeAuth.hasLock()) {
        await window.LifeAuth.unlock(passphrase);
      } else {
        await window.LifeAuth.setLock(passphrase);
      }
      hideAuthOverlay();
      updateLockStatus();
    } catch (error) {
      $("#authError").textContent = error.message || "잠금 처리에 실패했다.";
    }
  }

  function setDeep(path, value) {
    const keys = path.split(".");
    let target = entry;
    keys.slice(0, -1).forEach((key) => {
      target = target[key];
    });
    target[keys[keys.length - 1]] = value;
    saveAndRender();
  }

  function renderDate() {
    const date = new Date();
    $("#todayLabel").textContent = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    });
    const reminders = window.LIFE_OS_SEED.reminders;
    const pick = Math.abs(today.split("-").join("")) % reminders.length;
    $("#dailyReminder").textContent = reminders[pick];
  }

  function renderScore() {
    const score = window.LifeEvolution.dailyScore(
      entry,
      state.settings.targets,
      state.settings.oneQuestionJournal
    );
    $("#todayScore").textContent = score;
    $("#habitStatus").textContent = score >= 80 ? "강함" : score >= 55 ? "유지" : "축소";
  }

  function renderMorningGate() {
    $("#morningStatus").textContent = entry.morning.done ? "완료" : "잠금 해제 전";
    $("#morningGate").classList.toggle("is-complete", entry.morning.done);
    $("#morningGateBody").innerHTML = `
      <label class="range-row">
        <span>오늘 에너지 <b id="energyValue">${entry.morning.energy}</b></span>
        <input type="range" min="1" max="5" step="1" id="morningEnergy" value="${entry.morning.energy}">
      </label>
      <label class="field-label">
        오늘 모드
        <select class="text-input" id="morningMode">
          ${["방어", "전진", "회복"].map((mode) => `<option value="${mode}" ${entry.morning.mode === mode ? "selected" : ""}>${mode}</option>`).join("")}
        </select>
      </label>
      <label class="field-label">
        오늘의 한 문장
        <input class="text-input" id="morningPledge" value="${escapeHtml(entry.morning.pledge)}" placeholder="예: 오전 10시에 AICPA 25분만 한다">
      </label>
      <button class="primary-btn" id="completeMorningBtn">${entry.morning.done ? "체크인 수정 완료" : "체크인 완료"}</button>
    `;
    $("#morningEnergy").addEventListener("input", (event) => {
      entry.morning.energy = Number(event.target.value);
      $("#energyValue").textContent = event.target.value;
      saveAndRender();
    });
    $("#morningMode").addEventListener("change", (event) => {
      entry.morning.mode = event.target.value;
      saveAndRender();
    });
    $("#morningPledge").addEventListener("input", (event) => {
      entry.morning.pledge = event.target.value;
      saveAndRender();
    });
    $("#completeMorningBtn").addEventListener("click", () => {
      entry.morning.done = true;
      if (!entry.morning.pledge.trim()) {
        entry.morning.pledge = "오늘 TOP 3 중 하나를 2분 버전으로 시작한다.";
      }
      window.LifeStorage.saveState(state);
      renderMorningGate();
      saveAndRender();
    });
  }

  function renderMissions() {
    const list = $("#missionList");
    list.innerHTML = entry.missions
      .map(
        (mission, index) => `
          <div class="mission-row">
            <label class="check-line">
              <input type="checkbox" data-mission-done="${index}" ${mission.done ? "checked" : ""}>
              <span>완료</span>
            </label>
            <input class="text-input mission-title" data-mission-field="${index}.title" value="${escapeHtml(mission.title)}" aria-label="미션 ${index + 1}">
            <div class="if-then-grid">
              <label>언제<input class="text-input" data-mission-field="${index}.ifWhen" value="${escapeHtml(mission.ifWhen)}"></label>
              <label>어디서<input class="text-input" data-mission-field="${index}.ifWhere" value="${escapeHtml(mission.ifWhere)}"></label>
              <label>무엇을<input class="text-input" data-mission-field="${index}.ifAction" value="${escapeHtml(mission.ifAction)}"></label>
            </div>
          </div>
        `
      )
      .join("");

    $$("[data-mission-done]").forEach((input) => {
      input.addEventListener("change", (event) => {
        entry.missions[Number(event.target.dataset.missionDone)].done = event.target.checked;
        saveAndRender();
      });
    });
    $$("[data-mission-field]").forEach((input) => {
      input.addEventListener("input", (event) => {
        const [index, field] = event.target.dataset.missionField.split(".");
        entry.missions[Number(index)][field] = event.target.value;
        saveAndRender();
      });
    });
  }

  function renderHabits() {
    const list = $("#habitList");
    const coreHabits = window.LIFE_OS_SEED.habits.filter((habit) =>
      window.LIFE_OS_SEED.coreHabitIds.includes(habit.id)
    );
    const guardrailHabits = window.LIFE_OS_SEED.habits.filter((habit) =>
      window.LIFE_OS_SEED.guardrailHabitIds.includes(habit.id)
    );
    list.innerHTML = coreHabits
      .map((habit) => {
        const target = state.settings.targets[habit.id] || habit.target;
        const value = entry.habits[habit.id];
        const completion = Math.round(
          window.LifeEvolution.habitCompletion(entry, habit, state.settings.targets) * 100
        );
        if (habit.type === "checkbox") {
          return `
            <label class="habit-row">
              <span>
                <strong>${escapeHtml(habit.label)}</strong>
                <small>${completion}%</small>
              </span>
              <input type="checkbox" data-habit-check="${habit.id}" ${value ? "checked" : ""}>
            </label>
          `;
        }
        return `
          <label class="habit-row">
            <span>
              <strong>${escapeHtml(habit.label)}</strong>
              <small>목표 ${target}${escapeHtml(habit.unit)} · ${completion}%</small>
            </span>
            <input class="number-input" type="number" inputmode="decimal" step="${habit.step || 1}" min="0" data-habit-number="${habit.id}" value="${escapeHtml(value)}">
          </label>
        `;
      })
      .join("");
    $("#guardrailList").innerHTML = guardrailHabits
      .map((habit) => {
        const value = entry.habits[habit.id];
        const completion = Math.round(
          window.LifeEvolution.habitCompletion(entry, habit, state.settings.targets) * 100
        );
        return `
          <label class="guardrail-row">
            <span><strong>${escapeHtml(habit.label)}</strong><small>${completion}%</small></span>
            <input type="checkbox" data-habit-check="${habit.id}" ${value ? "checked" : ""}>
          </label>
        `;
      })
      .join("");

    $$("[data-habit-check]").forEach((input) => {
      input.addEventListener("change", (event) => {
        entry.habits[event.target.dataset.habitCheck] = event.target.checked;
        saveAndRender();
      });
    });
    $$("[data-habit-number]").forEach((input) => {
      input.addEventListener("input", (event) => {
        entry.habits[event.target.dataset.habitNumber] = Number(event.target.value || 0);
        saveAndRender();
      });
    });
  }

  function renderJournal() {
    const oneQuestion = state.settings.oneQuestionJournal;
    $("#journalMode").textContent = oneQuestion ? "1문항" : "3문항";
    $("#journalTitle").textContent = oneQuestion ? "초소형 저널" : "60초 저널";
    const fields = oneQuestion
      ? [
          {
            key: "oneLine",
            label: "오늘 The One에 가까워진 행동 하나만 적는다"
          }
        ]
      : [
          { key: "forward", label: "오늘 The One에 가까워진 행동 1가지" },
          { key: "overheat", label: "오늘 과열·집착·재극인 행동" },
          { key: "tomorrow", label: "내일 한 가지만 바꾼다면" }
        ];

    $("#journalFields").innerHTML = fields
      .map(
        (field) => `
          <label class="field-label">
            ${escapeHtml(field.label)}
            <textarea class="text-area" data-journal="${field.key}" rows="3">${escapeHtml(entry.journal[field.key])}</textarea>
          </label>
        `
      )
      .join("");

    $$("[data-journal]").forEach((input) => {
      input.addEventListener("input", (event) => {
        entry.journal[event.target.dataset.journal] = event.target.value;
        saveAndRender();
      });
    });
  }

  function renderCoach() {
    const warnings = window.LifeEvolution.warnings(entry, state.settings.targets);
    const firstOpenMission = entry.missions.find((mission) => !mission.done);
    const gate = entry.morning.done
      ? `아침 게이트 완료. 모드=${entry.morning.mode}, 에너지=${entry.morning.energy}/5.`
      : "아침 게이트가 비어 있다. 먼저 60초 체크인으로 오늘의 마찰을 낮춘다.";
    const science = firstOpenMission
      ? `가장 작은 실행: ${firstOpenMission.ifWhen}에 ${firstOpenMission.ifWhere}에서 "${firstOpenMission.ifAction}"만 한다.`
      : "오늘 TOP 3는 완료됐다. 새 목표를 추가하지 말고 기록과 회복으로 마감한다.";
    const gaeun = entry.habits.waterGold
      ? "水金 보강은 체크됐다. 다음은 과열 회피를 유지한다."
      : "水金 보강: 물, 문서, 리서치, 법·회계·데이터 정리 중 하나를 10분만 한다.";
    const buddhist =
      Number(entry.buddhist.greed) + Number(entry.buddhist.anger) + Number(entry.buddhist.delusion) >= 5
        ? "탐·진·치가 높다. 오늘의 전략은 전진보다 정념, 호흡, 말 줄이기다."
        : "탐·진·치가 관리권 안에 있다. 작게 전진한다.";
    const reviewInfo = goalReviewInfo();
    const goalReview = reviewInfo.due
      ? "목표 업데이트 주기가 왔다. 설정 탭의 Grand Plan 수정 질문을 복사해서 다음 대화에 붙여라."
      : `목표 업데이트는 아직 유지 구간이다. ${reviewInfo.label}.`;

    $("#coachBrief").innerHTML = `
      ${warnings.map((warning) => `<p class="warning">${escapeHtml(warning)}</p>`).join("")}
      <p><strong>게이트</strong><br>${escapeHtml(gate)}</p>
      <p><strong>과학 코치</strong><br>${escapeHtml(science)}</p>
      <p><strong>개운 코치</strong><br>${escapeHtml(gaeun)}</p>
      <p><strong>불교 코치</strong><br>${escapeHtml(buddhist)}</p>
      <p><strong>업데이트 코치</strong><br>${escapeHtml(goalReview)}</p>
    `;
  }

  function renderFeedback() {
    const entries = window.LifeStorage.orderedEntries(state, 7);
    const stats = window.LifeEvolution.weeklyStats(
      entries,
      state.settings.targets,
      state.settings.oneQuestionJournal
    );
    $("#weeklyStats").innerHTML = `
      <div class="metric"><strong>${stats.averageScore}</strong><span>7일 평균 점수</span></div>
      <div class="metric"><strong>${stats.days}</strong><span>기록 일수</span></div>
      <div class="metric"><strong>${stats.journalMisses}</strong><span>최근 저널 누락</span></div>
    `;
    $("#weeklyTrend").innerHTML = entries.length
      ? entries
          .map((item) => {
            const score = window.LifeEvolution.dailyScore(
              item,
              state.settings.targets,
              state.settings.oneQuestionJournal
            );
            return `<div class="trend-bar" title="${item.date}: ${score}"><span style="height:${Math.max(8, score)}%"></span><small>${item.date.slice(5)}</small></div>`;
          })
          .join("")
      : "<p class=\"muted\">아직 추세 데이터가 없다.</p>";
    $("#adjustmentLog").innerHTML = state.adjustments.length
      ? state.adjustments
          .slice(-8)
          .reverse()
          .map(
            (item) =>
              `<p><strong>${escapeHtml(item.habit)}</strong>: ${escapeHtml(item.before)} -> ${escapeHtml(item.after)}<br><span>${escapeHtml(item.reason)}</span></p>`
          )
          .join("")
      : "<p>아직 자동 조정 기록이 없다. 3일 이상 입력하면 시스템이 움직이기 시작한다.</p>";

    $("#sciencePrinciples").innerHTML = window.LIFE_OS_SEED.sciencePrinciples
      .map((item) => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.rule)}</span></li>`)
      .join("");
  }

  function renderGrandPlan() {
    const info = goalReviewInfo();
    $("#goalReviewStatus").textContent = info.label;
    $("#grandPlanSnapshot").innerHTML = [
      ["North Star", state.grandPlan.northStar],
      ["10년", state.grandPlan.tenYear],
      ["1년", state.grandPlan.oneYear],
      ["분기", state.grandPlan.quarter],
      ["이번 달", state.grandPlan.month],
      ["이번 주", state.grandPlan.week]
    ]
      .map(
        ([title, body]) => `
          <div class="goal-card">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(body || "비어 있음")}</span>
          </div>
        `
      )
      .join("");

    $("#mandaratGrid").innerHTML = window.LIFE_OS_SEED.mandarat
      .map(
        (cell) => `
          <div class="mandarat-cell ${cell.title === "The One" ? "is-center" : ""}">
            <strong>${escapeHtml(cell.title)}</strong>
            <span>${cell.items.map(escapeHtml).join(" · ")}</span>
          </div>
        `
      )
      .join("");
    $("#ikigaiList").innerHTML = window.LIFE_OS_SEED.ikigai
      .map(([title, body]) => `<div class="mini-block"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`)
      .join("");
    $("#hillModule").innerHTML = window.LIFE_OS_SEED.hill
      .map((item) => `<div class="mini-block"><span>${escapeHtml(item)}</span></div>`)
      .join("");
  }

  function renderSaju() {
    $("#gaeunList").innerHTML = window.LIFE_OS_SEED.gaeunPriorities
      .map(
        (item) => `
          <div class="rank-row">
            <b>${item.rank}</b>
            <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.action)}</small></span>
          </div>
        `
      )
      .join("");

    const sliders = [
      ["greed", "탐욕"],
      ["anger", "분노"],
      ["delusion", "혼란"]
    ];
    $("#buddhistLog").innerHTML = `
      ${sliders
        .map(
          ([key, label]) => `
            <label class="range-row">
              <span>${label}<b id="${key}Value">${entry.buddhist[key]}</b></span>
              <input type="range" min="0" max="3" step="1" data-buddhist-range="${key}" value="${entry.buddhist[key]}">
            </label>
          `
        )
        .join("")}
      <label class="habit-row"><span><strong>과열됨</strong><small>말·투자·감정 속도 과다</small></span><input type="checkbox" data-buddhist-check="overheated" ${entry.buddhist.overheated ? "checked" : ""}></label>
      <label class="habit-row"><span><strong>집착함</strong><small>결과·돈·인정에 과하게 붙음</small></span><input type="checkbox" data-buddhist-check="attachment" ${entry.buddhist.attachment ? "checked" : ""}></label>
    `;
    $$("[data-buddhist-range]").forEach((input) => {
      input.addEventListener("input", (event) => {
        const key = event.target.dataset.buddhistRange;
        entry.buddhist[key] = Number(event.target.value);
        $(`#${key}Value`).textContent = event.target.value;
        saveAndRender();
      });
    });
    $$("[data-buddhist-check]").forEach((input) => {
      input.addEventListener("change", (event) => {
        entry.buddhist[event.target.dataset.buddhistCheck] = event.target.checked;
        saveAndRender();
      });
    });

    $("#resourceList").innerHTML = (window.LIFE_OS_SEED.profile.resourceLevers || window.LIFE_OS_SEED.profile.constraints || [])
      .map((item) => `<div class="constraint-item">${escapeHtml(item)}</div>`)
      .join("");
  }

  function generateMarkdown() {
    const entries = window.LifeStorage.orderedEntries(state, 7);
    const stats = window.LifeEvolution.weeklyStats(
      entries,
      state.settings.targets,
      state.settings.oneQuestionJournal
    );
    const habitLines = window.LIFE_OS_SEED.habits
      .map((habit) => {
        const value = entry.habits[habit.id];
        const target = state.settings.targets[habit.id] || habit.target;
        return `- ${habit.label}: ${habit.type === "checkbox" ? (value ? "완료" : "미완료") : `${value}/${target}${habit.unit}`}`;
      })
      .join("\n");
    const missionLines = entry.missions
      .map((mission, index) => `- ${index + 1}. [${mission.done ? "x" : " "}] ${mission.title} / If ${mission.ifWhen} at ${mission.ifWhere}, then ${mission.ifAction}`)
      .join("\n");
    const warnings = window.LifeEvolution.warnings(entry, state.settings.targets);

    return `# Life OS Coach Brief

## Context
- 사용자: ${window.LIFE_OS_SEED.profile.name}
- 날짜: ${today}
- 톤: ${window.LIFE_OS_SEED.profile.coachTone}
- 핵심: 과학적 자기개선 + 사주명리·불교 듀얼코어
- 아침 게이트: ${entry.morning.done ? `${entry.morning.mode}, 에너지 ${entry.morning.energy}/5, ${entry.morning.pledge}` : "미완료"}

## Grand Plan
- North Star: ${state.grandPlan.northStar}
- 1년: ${state.grandPlan.oneYear}
- 분기: ${state.grandPlan.quarter}
- 이번 주: ${state.grandPlan.week}
- 목표 업데이트 상태: ${goalReviewInfo().label}

## Today Score
- 점수: ${window.LifeEvolution.dailyScore(entry, state.settings.targets, state.settings.oneQuestionJournal)}/100
- 7일 평균: ${stats.averageScore}/100
- 경고: ${warnings.length ? warnings.join(" / ") : "없음"}

## Top 3
${missionLines}

## Habits
${habitLines}

## Buddhist Log
- 탐욕: ${entry.buddhist.greed}/3
- 분노: ${entry.buddhist.anger}/3
- 혼란: ${entry.buddhist.delusion}/3
- 과열: ${entry.buddhist.overheated ? "예" : "아니오"}
- 집착: ${entry.buddhist.attachment ? "예" : "아니오"}

## Journal
- 전진: ${entry.journal.forward || entry.journal.oneLine || "(비어 있음)"}
- 과열: ${entry.journal.overheat || "(비어 있음)"}
- 내일 수정: ${entry.journal.tomorrow || "(비어 있음)"}

## Ask
냉정한 코치처럼 다음 24시간의 TOP 3와 실패 방지 설계를 제시해줘.`;
  }

  function generateDeployChecklist() {
    const lockLine = window.LifeAuth.hasLock() ? "완료" : "필요";
    const backupLine = state.settings.lastEncryptedBackupAt
      ? formatDateTime(state.settings.lastEncryptedBackupAt)
      : "아직 없음";
    return `# Hyo Life OS 어디서든 쓰기 체크리스트

## 1. 공개 전
- 검증 실행: powershell -ExecutionPolicy Bypass -File .\\scripts\\verify.ps1
- 결과: 민감 표현 없음, PWA 필수 파일 있음, 보안 모듈 캐시됨
- 현재 앱 잠금: ${lockLine}

## 2. 배포
- GitHub Pages, Cloudflare Pages, Netlify 중 하나에 hyo-life-os 폴더 내용을 올린다.
- 공개되는 것은 앱 코드뿐이다. 개인 기록은 서버가 아니라 각 기기의 브라우저 저장소에 남는다.

## 3. 새 기기에서 사용
- 공개 URL 접속
- 앱 잠금 설정
- 기존 데이터를 쓰려면 암호화 백업 파일을 가져온다.
- 마지막 암호화 백업: ${backupLine}

## 4. 주간 운영
- 매주 1회 암호화 백업
- 3일 실패하면 목표를 낮추고, 7일 85% 이상이면 목표를 조금 올린다.
- 큰 결정은 수면, 감정, 과열 점수가 안정적일 때만 처리한다.`;
  }

  function generateGoalUpdateBrief() {
    const stats = window.LifeEvolution.weeklyStats(
      window.LifeStorage.orderedEntries(state, 7),
      state.settings.targets,
      state.settings.oneQuestionJournal
    );
    return `# Life OS Goal Update Request

## 현재 Grand Plan
- North Star: ${state.grandPlan.northStar}
- 10년: ${state.grandPlan.tenYear}
- 1년: ${state.grandPlan.oneYear}
- 분기: ${state.grandPlan.quarter}
- 이번 달: ${state.grandPlan.month}
- 이번 주: ${state.grandPlan.week}

## 최근 실행 데이터
- 7일 평균 점수: ${stats.averageScore}/100
- 기록 일수: ${stats.days}
- 최근 저널 누락: ${stats.journalMisses}
- 마지막 목표 업데이트: ${formatDateTime(state.grandPlan.lastUpdatedAt)}

## 코치에게 요청
냉정한 코치처럼 아래 순서로 나에게 질문하고, 답을 바탕으로 목표를 업데이트해줘.
1. 지금 가장 큰 현실 레버리지는 무엇인가?
2. 이번 주에 버려야 할 목표는 무엇인가?
3. 30일 안에 측정 가능한 산출물은 무엇인가?
4. 수면·돈·관계·학업 중 가장 약한 축은 무엇인가?
5. 사주명리·불교 기준으로 과열 또는 집착이 어디서 생기는가?
6. 목표를 30% 줄이면 무엇만 남는가?
7. 다음 7일 TOP 3는 무엇이어야 하는가?`;
  }

  function renderExport() {
    $("#markdownExport").value = generateMarkdown();
  }

  function renderSettings() {
    const storageBytes = new Blob([JSON.stringify(state)]).size;
    const notification = "Notification" in window ? Notification.permission || "default" : "미지원";
    const swStatus = "serviceWorker" in navigator ? "지원됨" : "미지원";
    const lockStatus = window.LifeAuth.hasLock() ? "켜짐" : "꺼짐";
    const lockHint = window.LifeAuth.hasLock()
      ? "공개 URL 사용 시 기기 안의 최소 방어선이 있다."
      : "공개 URL 사용 전 4자리 PIN 설정 권장.";

    $("#settingsStatus").innerHTML = `
      <div class="setting-card"><small>앱 잠금</small><strong>${escapeHtml(lockStatus)}</strong><span>${escapeHtml(lockHint)}</span></div>
      <div class="setting-card"><small>암호화 백업</small><strong>${escapeHtml(formatDateTime(state.settings.lastEncryptedBackupAt))}</strong><span>여러 기기 사용의 핵심 루트.</span></div>
      <div class="setting-card"><small>로컬 데이터</small><strong>${Math.max(1, Math.round(storageBytes / 1024))}KB</strong><span>이 브라우저 안에 저장됨.</span></div>
      <div class="setting-card"><small>PWA/알림</small><strong>${escapeHtml(swStatus)}</strong><span>알림 권한: ${escapeHtml(notification)}</span></div>
    `;

    const numericHabits = window.LIFE_OS_SEED.habits.filter((habit) => habit.type === "number");
    $("#targetSettings").innerHTML = numericHabits
      .map((habit) => {
        const target = state.settings.targets[habit.id] || habit.target;
        return `
          <label class="target-row">
            <span>
              <strong>${escapeHtml(habit.label)}</strong>
              <small>허용 범위 ${habit.min}-${habit.max}${escapeHtml(habit.unit)}, 자동 조정 전 수동 기준값</small>
            </span>
            <input class="number-input" type="number" inputmode="decimal" step="${habit.step || 1}" min="${habit.min || 0}" max="${habit.max || ""}" data-target-setting="${habit.id}" value="${escapeHtml(target)}">
          </label>
        `;
      })
      .join("");

    $("#oneQuestionToggle").checked = state.settings.oneQuestionJournal;
    $("#morningFocusToggle").checked = state.settings.morningFocusLock;
    $("#goalCadenceInput").value = state.settings.goalReviewCadenceDays || 7;
    $("#deployChecklist").value = generateDeployChecklist();
    $("#goalUpdateBrief").value = generateGoalUpdateBrief();

    const goalFields = [
      ["northStar", "North Star", "궁극 방향"],
      ["tenYear", "10년", "장기 포지션"],
      ["oneYear", "1년", "올해의 승부"],
      ["quarter", "분기", "이번 분기의 핵심 산출물"],
      ["month", "이번 달", "30일 안에 측정할 결과"],
      ["week", "이번 주", "다음 7일의 좁은 전선"]
    ];
    $("#goalEditor").innerHTML = goalFields
      .map(
        ([key, label, hint]) => `
          <label class="field-label">
            ${escapeHtml(label)}
            <textarea class="text-area" rows="3" data-goal-field="${key}" placeholder="${escapeHtml(hint)}">${escapeHtml(state.grandPlan[key])}</textarea>
          </label>
        `
      )
      .join("");

    $$("[data-target-setting]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const habit = window.LIFE_OS_SEED.habits.find((item) => item.id === event.target.dataset.targetSetting);
        state.settings.targets[habit.id] = clampTarget(event.target.value, habit);
        window.LifeStorage.saveState(state);
        renderAll();
      });
    });
    $$("[data-goal-field]").forEach((input) => {
      input.addEventListener("input", (event) => {
        state.grandPlan[event.target.dataset.goalField] = event.target.value;
        window.LifeStorage.saveState(state);
        renderGrandPlan();
        renderExport();
        $("#goalUpdateBrief").value = generateGoalUpdateBrief();
      });
    });
  }

  function wireEvents() {
    $("#authPrimaryBtn").addEventListener("click", handleAuthPrimary);
    $("#authPassphrase").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleAuthPrimary();
      }
    });
    $("#lockNowBtn").addEventListener("click", () => {
      window.LifeAuth.lockNow();
      showAuthOverlay("lock");
    });

    $$(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.disabled) return;
        activateTab(tab.dataset.tab);
      });
    });

    $("#seedMissionsBtn").addEventListener("click", () => {
      entry.missions = JSON.parse(JSON.stringify(window.LIFE_OS_SEED.defaultMissions)).map(
        (mission) => ({ ...mission, done: false })
      );
      window.LifeStorage.saveState(state);
      renderMissions();
      saveAndRender();
    });

    $("#runReviewBtn").addEventListener("click", () => {
      const review = window.LifeEvolution.runWeeklyReview(state);
      renderAll();
      $("#adjustmentLog").insertAdjacentHTML(
        "afterbegin",
        `<p class="success"><strong>리뷰 완료</strong>: ${review.changes.length}개 조정</p>`
      );
    });

    $("#copyBriefBtn").addEventListener("click", async () => {
      renderExport();
      const text = $("#markdownExport").value;
      try {
        await navigator.clipboard.writeText(text);
        $("#copyBriefBtn").textContent = "복사됨";
        setTimeout(() => ($("#copyBriefBtn").textContent = "복사"), 1200);
      } catch {
        $("#markdownExport").select();
      }
    });

    $("#downloadJsonBtn").addEventListener("click", () => {
      state.settings.lastPlainBackupAt = new Date().toISOString();
      window.LifeStorage.saveState(state);
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hyo-life-os-${today}.json`;
      link.click();
      URL.revokeObjectURL(url);
      renderSettings();
    });

    $("#downloadEncryptedBtn").addEventListener("click", async () => {
      const passphrase = $("#backupPassphrase").value;
      const previousBackupAt = state.settings.lastEncryptedBackupAt;
      try {
        state.settings.lastEncryptedBackupAt = new Date().toISOString();
        window.LifeStorage.saveState(state);
        const encrypted = await window.LifeCrypto.encryptJson(state, passphrase);
        const blob = new Blob([JSON.stringify(encrypted, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hyo-life-os-encrypted-${today}.json`;
        link.click();
        URL.revokeObjectURL(url);
        renderSettings();
      } catch (error) {
        state.settings.lastEncryptedBackupAt = previousBackupAt;
        window.LifeStorage.saveState(state);
        renderSettings();
        alert(error.message || "암호화 백업에 실패했습니다.");
      }
    });

    $("#importJsonInput").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          Object.keys(state).forEach((key) => delete state[key]);
          Object.assign(state, imported);
          window.LifeStorage.saveState(state);
          window.location.reload();
        } catch {
          alert("JSON을 읽지 못했습니다.");
        }
      };
      reader.readAsText(file);
    });

    $("#importEncryptedInput").addEventListener("change", (event) => {
      const file = event.target.files[0];
      const passphrase = $("#backupPassphrase").value;
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const payload = JSON.parse(reader.result);
          const imported = await window.LifeCrypto.decryptJson(payload, passphrase);
          Object.keys(state).forEach((key) => delete state[key]);
          Object.assign(state, imported);
          window.LifeStorage.saveState(state);
          window.location.reload();
        } catch (error) {
          alert(error.message || "암호화 백업을 복원하지 못했습니다.");
        }
      };
      reader.readAsText(file);
    });

    $("#notificationBtn").addEventListener("click", async () => {
      if (!("Notification" in window)) {
        $("#notificationBtn").textContent = "미지원";
        return;
      }
      const permission = await Notification.requestPermission();
      $("#notificationBtn").textContent = permission === "granted" ? "알림 허용" : "알림 차단";
      if (permission === "granted") {
        new Notification("Hyo Life OS", {
          body: "매일 아침: 적고, 검증하고, 작게 실행한다."
        });
      }
    });

    $("#setLockBtn").addEventListener("click", async () => {
      try {
        await window.LifeAuth.setLock($("#newLockPassphrase").value);
        $("#newLockPassphrase").value = "";
        updateLockStatus();
        renderSettings();
      } catch (error) {
        alert(error.message || "잠금 설정에 실패했습니다.");
      }
    });

    $("#clearLockBtn").addEventListener("click", () => {
      const ok = confirm("이 기기의 앱 잠금을 해제할까요?");
      if (!ok) return;
      window.LifeAuth.clearLock();
      updateLockStatus();
      renderSettings();
    });

    $("#refreshSettingsBtn").addEventListener("click", renderSettings);

    $("#resetTargetsBtn").addEventListener("click", () => {
      const ok = confirm("수면·공부·운동 목표를 초기값으로 되돌릴까요?");
      if (!ok) return;
      window.LIFE_OS_SEED.habits.forEach((habit) => {
        state.settings.targets[habit.id] = habit.target;
      });
      window.LifeStorage.saveState(state);
      renderAll();
    });

    $("#oneQuestionToggle").addEventListener("change", (event) => {
      state.settings.oneQuestionJournal = event.target.checked;
      window.LifeStorage.saveState(state);
      renderAll();
    });

    $("#morningFocusToggle").addEventListener("change", (event) => {
      state.settings.morningFocusLock = event.target.checked;
      window.LifeStorage.saveState(state);
      renderAll();
    });

    $("#goalCadenceInput").addEventListener("change", (event) => {
      const value = Math.max(3, Math.min(30, Number(event.target.value || 7)));
      state.settings.goalReviewCadenceDays = value;
      window.LifeStorage.saveState(state);
      renderAll();
    });

    $("#recordGoalUpdateBtn").addEventListener("click", () => {
      const now = new Date().toISOString();
      state.grandPlan.lastUpdatedAt = now;
      state.goalUpdates.push({
        createdAt: now,
        northStar: state.grandPlan.northStar,
        oneYear: state.grandPlan.oneYear,
        quarter: state.grandPlan.quarter,
        week: state.grandPlan.week
      });
      window.LifeStorage.saveState(state);
      renderAll();
    });

    $("#resetGrandPlanBtn").addEventListener("click", () => {
      const ok = confirm("Grand Plan을 기본값으로 되돌릴까요?");
      if (!ok) return;
      state.grandPlan = defaultGrandPlan();
      window.LifeStorage.saveState(state);
      renderAll();
    });

    $("#copyGoalUpdateBriefBtn").addEventListener("click", async () => {
      const text = generateGoalUpdateBrief();
      $("#goalUpdateBrief").value = text;
      try {
        await navigator.clipboard.writeText(text);
        $("#copyGoalUpdateBriefBtn").textContent = "복사됨";
        setTimeout(() => ($("#copyGoalUpdateBriefBtn").textContent = "업데이트 질문 복사"), 1200);
      } catch {
        $("#goalUpdateBrief").select();
      }
    });

    $("#copyDeployChecklistBtn").addEventListener("click", async () => {
      const text = generateDeployChecklist();
      $("#deployChecklist").value = text;
      try {
        await navigator.clipboard.writeText(text);
        $("#copyDeployChecklistBtn").textContent = "복사됨";
        setTimeout(() => ($("#copyDeployChecklistBtn").textContent = "체크리스트 복사"), 1200);
      } catch {
        $("#deployChecklist").select();
      }
    });
  }

  function renderAll() {
    renderDate();
    renderMorningGate();
    renderScore();
    renderMissions();
    renderHabits();
    renderJournal();
    renderCoach();
    renderFeedback();
    renderGrandPlan();
    renderSaju();
    renderExport();
    renderSettings();
    renderTabAccess();
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    }
  }

  wireEvents();
  renderAll();
  updateLockStatus();
  if (!window.LifeAuth.isUnlocked()) {
    showAuthOverlay();
  }
  registerServiceWorker();
})();
