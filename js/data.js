window.LIFE_OS_SEED = {
  profile: {
    name: "위효연",
    mission: "The One: 법, AI, 금융, 시뮬레이션, 글로벌 제도권을 통합해 장기 영향력을 만든다.",
    saju: "丙寅年 癸巳月 甲寅日 己巳時 / 사월 갑목 / 水金 보강, 火燥土 절제",
    resourceLevers: [
      "공적 지원은 현금흐름 방어와 학습 시간을 만드는 현재의 핵심 레버리지다.",
      "참여형 일정은 생활 리듬, 사회적 접점, 실행 압박을 제공하는 구조적 자산이다.",
      "해외체류·장기 일정 변경은 혜택 유지 조건과 담당 확인을 먼저 거친다.",
      "큰 투자·계약은 수면/감정/과열 점수 확인 후 결정한다."
    ],
    reviewCadence: [
      "매일: 2분 체크인, TOP 3, 수면·공부·운동·기록 입력",
      "매주: 15분 리뷰, 목표 난이도 자동/수동 조정, 다음 주 TOP 3 방향 결정",
      "매월: 45분 Grand Plan 업데이트, 학업·커리어·돈·건강·개운 축 재정렬",
      "분기: 90분 전략 리뷰, The One 로드맵과 현실 조건을 다시 맞춘다"
    ],
    coachTone: "냉정한 코치: 비난 없이 수치와 다음 행동만 제시"
  },
  reminders: [
    "생각하지 말고 적는다. 적은 뒤 검증한다. 검증한 뒤 작게 실행한다.",
    "The One은 감정의 폭발이 아니라 매일 축적되는 시스템이다.",
    "오늘의 승리는 거대한 결심이 아니라 완료 가능한 TOP 3에서 나온다.",
    "과열되면 공격하지 말고 기록, 수면, 정리로 식힌다."
  ],
  sciencePrinciples: [
    {
      name: "Goal Setting",
      rule: "The One을 10년, 1년, 분기, 이번 주, 오늘 TOP 3으로 분해한다."
    },
    {
      name: "Implementation Intention",
      rule: "모든 미션은 언제, 어디서, 무엇을 할지 if-then 형식으로 만든다."
    },
    {
      name: "COM-B",
      rule: "의지력 대신 능력, 기회, 동기를 각각 낮은 마찰로 설계한다."
    },
    {
      name: "Fogg Behavior Model",
      rule: "실패하면 동기를 탓하지 않고 행동을 더 작게 만든다."
    },
    {
      name: "Self-Determination",
      rule: "자율성, 유능감, 관계감을 해치지 않는 방식으로 지속한다."
    },
    {
      name: "Feedback Control",
      rule: "현재 위치와 목표의 차이를 매주 보고, 시스템을 자동 수정한다."
    }
  ],
  coreHabitIds: ["sleep", "study", "exercise"],
  guardrailHabitIds: ["record", "risk", "waterGold", "fireEarthAvoid"],
  habits: [
    {
      id: "sleep",
      label: "수면",
      unit: "시간",
      type: "number",
      target: 7,
      min: 5.5,
      max: 8.5,
      step: 0.5,
      core: true
    },
    {
      id: "study",
      label: "공부·리서치",
      unit: "분",
      type: "number",
      target: 90,
      min: 15,
      max: 240,
      step: 15,
      core: true
    },
    {
      id: "exercise",
      label: "운동",
      unit: "분",
      type: "number",
      target: 90,
      min: 10,
      max: 120,
      step: 10,
      core: true
    },
    {
      id: "record",
      label: "기록",
      unit: "",
      type: "checkbox",
      target: 1,
      core: true
    },
    {
      id: "risk",
      label: "투자·계약 충동 차단",
      unit: "",
      type: "checkbox",
      target: 1,
      core: true
    },
    {
      id: "waterGold",
      label: "水金 보강 행동",
      unit: "",
      type: "checkbox",
      target: 1,
      core: false
    },
    {
      id: "fireEarthAvoid",
      label: "火土 과열 회피",
      unit: "",
      type: "checkbox",
      target: 1,
      core: false
    }
  ],
  defaultMissions: [
    {
      title: "AICPA/CFA/AI 중 하나를 45분만 전진",
      ifWhen: "오전 첫 집중 블록",
      ifWhere: "책상",
      ifAction: "타이머 45분을 켜고 한 강의 또는 한 문제 세트를 끝낸다"
    },
    {
      title: "돈·계약·지원 레버리지 운영조건 하나 문서화",
      ifWhen: "점심 전",
      ifWhere: "노트 또는 앱",
      ifAction: "오늘의 혜택 유지 조건 또는 미확정 리스크를 한 줄로 적고 다음 확인 행동을 쓴다"
    },
    {
      title: "과열 방지 루틴 실행",
      ifWhen: "저녁",
      ifWhere: "침실 밖",
      ifAction: "10분 걷기 또는 스트레칭 후 내일 TOP 1을 적는다"
    }
  ],
  gaeunPriorities: [
    {
      rank: 1,
      title: "거주지·방위",
      action: "서늘함, 물, 금, 안정된 제도권 인프라에 오래 노출된다."
    },
    {
      rank: 2,
      title: "직업·돈 버는 방식",
      action: "데이터, 법, 금융, 리스크관리, AI 자동화 중심으로 돈을 번다."
    },
    {
      rank: 3,
      title: "사람·팀·배우자",
      action: "차분한 전문가, 회계·세무·법무·리스크형 사람을 가까이 둔다."
    },
    {
      rank: 4,
      title: "공간 세팅",
      action: "북·서·북서, 남색·검정·흰색·은색·회색, 정돈된 책상."
    },
    {
      rank: 5,
      title: "이름·브랜드",
      action: "법적 개명보다 필명, 상호, 브랜드를 水金 이미지로 먼저 실험한다."
    },
    {
      rank: 6,
      title: "루틴",
      action: "수면, 기록, 공부, 리스크관리로 과열을 식힌다."
    }
  ],
  mandarat: [
    {
      title: "The One",
      items: ["법", "AI", "금융", "시뮬레이션", "글로벌 제도권", "가족", "문명", "자본"]
    },
    {
      title: "학업",
      items: ["방통대 마무리", "AICPA FAR", "CFA L1", "영어", "일본어", "AI 기초", "퀀트", "논문 읽기"]
    },
    {
      title: "커리어",
      items: ["Legal-AI", "퀀트", "M&A", "컴플라이언스", "리서치", "콘텐츠", "네트워크", "포트폴리오"]
    },
    {
      title: "자본",
      items: ["현금흐름", "부채관리", "손실한도", "세금", "분산", "리스크", "장기국채", "귀금속"]
    },
    {
      title: "건강",
      items: ["수면", "수영", "코어", "걷기", "2끼", "수분", "과음금지", "과열회피"]
    },
    {
      title: "개운",
      items: ["水", "金", "거주지", "직업", "사람", "공간", "브랜드", "루틴"]
    },
    {
      title: "불교",
      items: ["정념", "정정진", "무상", "탐", "진", "치", "집착완화", "자비"]
    },
    {
      title: "관계",
      items: ["멘토", "전문가", "가족", "파트너", "신뢰", "문서", "경계", "협력"]
    },
    {
      title: "공간",
      items: ["정돈", "서늘함", "물가", "서북", "침실", "책상", "무채색", "소음차단"]
    }
  ],
  ikigai: [
    ["좋아하는 것", "성장, 학습, 자기계발, 가족 유대"],
    ["잘하는 것", "법적 추론, 문제 해결, 거시적 사고, 팩트체크"],
    ["세상이 필요한 것", "AI 윤리, 지속가능성, 불평등 완화, 미래 제도 설계"],
    ["보상받을 것", "Legal-AI, 데이터 분석, 투자 리서치, 글로벌 법·금융 컨설팅"]
  ],
  hill: [
    "명확한 목표를 매일 한 문장으로 읽는다.",
    "목표를 감정으로만 키우지 말고 오늘의 행동 하나로 바꾼다.",
    "반복 암시는 과학 엔진 위의 보조 장치로만 쓴다.",
    "신념은 검증과 실행을 통과할 때만 강화한다."
  ]
};
