window.LIFE_OS_SEED = {
  profile: {
    name: "위효연",
    alias: "The One Architect",
    mission:
      "법, AI, 금융, 시뮬레이션, 글로벌 제도권을 통합해 장기 영향력을 만드는 사람.",
    saju:
      "丙寅年 癸巳月 甲寅日 己巳時 / 사월 갑목 / 水金 보강, 火燥土 절제 / 정유대운",
    currentFrame: "병오년 화기 관리",
    coachTone: "냉정한 코치: 비난 없이 수치와 다음 행동만 제시",
    operatingDoctrine: [
      "생각은 휘발된다. 목표와 판단은 반드시 기록으로 고정한다.",
      "의지력을 믿지 않는다. 환경, 난이도, 프롬프트를 설계한다.",
      "명리는 공포가 아니라 리스크관리와 환경설계 프레임으로 쓴다.",
      "큰 결정은 수면, 감정, 과열 점수가 안정적일 때만 처리한다."
    ],
    reviewCadence: [
      "매일: 2분 체크인, TOP 3, 수면·공부·운동·기록 입력",
      "매주: 15분 리뷰, 목표 난이도 자동/수동 조정, 다음 주 TOP 3 결정",
      "매월: 45분 방법론 업데이트, 학업·커리어·돈·건강·개운 축 재정렬",
      "분기: 90분 전략 리뷰, The One 로드맵과 현실 조건을 다시 맞춘다"
    ]
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
    },
    {
      name: "Mindfulness",
      rule: "탐·진·치가 오르면 판단을 멈추고 호흡, 기록, 지연으로 반응한다."
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
      title: "현금흐름·계약·학습시간 운영조건 하나 문서화",
      ifWhen: "점심 전",
      ifWhere: "노트 또는 앱",
      ifAction: "오늘의 미확정 조건을 한 줄로 적고 다음 확인 행동을 쓴다"
    },
    {
      title: "과열 방지 루틴 실행",
      ifWhen: "저녁",
      ifWhere: "침실 밖",
      ifAction: "10분 걷기 또는 스트레칭 후 내일 TOP 1을 적는다"
    }
  ],
  radarSignals: [
    {
      title: "AI 자동화",
      signal: "법률·회계·리서치 자동화가 개인 생산성의 레버리지다.",
      action: "이번 주 하나의 반복 작업을 프롬프트 또는 스크립트로 자동화한다.",
      cadence: "주 1회"
    },
    {
      title: "법·규제",
      signal: "제도 변화는 Legal-AI, 컴플라이언스, M&A의 진입점이다.",
      action: "관심 규제 1개를 요약하고 사업 아이디어와 연결한다.",
      cadence: "주 1회"
    },
    {
      title: "금리·신용",
      signal: "큰돈 판단은 금리, 유동성, 손실한도 확인 뒤에만 한다.",
      action: "투자 전 체크리스트를 통과하지 못하면 보류한다.",
      cadence: "결정 전"
    },
    {
      title: "명리 리스크",
      signal: "火土 과열 구간에는 노출, 충동, 밤샘, 과음이 비용을 키운다.",
      action: "수면 6시간 미만이면 공격적 결정을 자동 보류한다.",
      cadence: "매일"
    }
  ],
  methodRadar: [
    {
      title: "행동과학 업데이트",
      sources: "목표설정, 실행의도, WOOP, 습관설계, 자기결정성이론",
      output: "새 방법은 1주 실험으로만 도입한다."
    },
    {
      title: "명리·불교 업데이트",
      sources: "조후·용신 관법, 대운/세운 리스크, 정념·정정진 수행",
      output: "공포 언어가 아니라 환경설계와 리스크관리로 번역한다."
    },
    {
      title: "커리어·사업 업데이트",
      sources: "Legal-AI, 퀀트, 회계/세무 자동화, 글로벌 제도권 진입",
      output: "아이디어는 샌드박스에 넣고 주간 리뷰에서 하나만 승격한다."
    }
  ],
  ideaPipeline: [
    {
      stage: "감지",
      items: ["Legal-AI 판례 요약", "개인 투자 리스크 체크봇", "학습 로그 자동 분석"]
    },
    {
      stage: "검증",
      items: ["사용자 1명 문제 정의", "30분 프로토타입", "수익/학습 가치 점수화"]
    },
    {
      stage: "실행",
      items: ["주 1개 산출물", "깃허브/블로그 기록", "피드백 후 축소 또는 승격"]
    }
  ],
  skillForge: [
    { name: "법학", level: 62, next: "기말/졸업 축 마무리, 판례 요약 루틴" },
    { name: "금융", level: 38, next: "CFA 또는 AICPA FAR 45분 블록 고정" },
    { name: "AI·코딩", level: 42, next: "작은 자동화 앱을 매주 하나 개선" },
    { name: "언어", level: 34, next: "영어 리딩 유지, 일본어 생존 표현" },
    { name: "신체", level: 51, next: "수면, 수영/걷기, 코어 안정화" }
  ],
  gaeunPriorities: [
    {
      rank: 1,
      weight: 30,
      title: "거주지·방위",
      action: "서늘함, 물, 금, 안정된 제도권 인프라에 오래 노출된다."
    },
    {
      rank: 2,
      weight: 25,
      title: "직업·돈 버는 방식",
      action: "데이터, 법, 금융, 리스크관리, AI 자동화 중심으로 돈을 번다."
    },
    {
      rank: 3,
      weight: 18,
      title: "사람·팀·배우자",
      action: "차분한 전문가, 회계·세무·법무·리스크형 사람을 가까이 둔다."
    },
    {
      rank: 4,
      weight: 10,
      title: "공간 세팅",
      action: "북·서·북서, 남색·검정·흰색·은색·회색, 정돈된 책상."
    },
    {
      rank: 5,
      weight: 9,
      title: "이름·브랜드",
      action: "법적 개명보다 필명, 상호, 브랜드를 水金 이미지로 먼저 실험한다."
    },
    {
      rank: 6,
      weight: 8,
      title: "루틴",
      action: "수면, 기록, 공부, 리스크관리로 과열을 식힌다."
    }
  ],
  residenceCareer: [
    {
      title: "거주지 기준",
      bullets: ["물가·강변·호수", "서늘한 동선", "도서관/학교/기관 접근", "소음과 야간 과열 차단"]
    },
    {
      title: "직업 기준",
      bullets: ["법·회계·세무", "리스크·컴플라이언스", "퀀트·데이터", "Legal-AI SaaS"]
    },
    {
      title: "사람 기준",
      bullets: ["차분함", "문서화", "장기주의", "돈과 감정을 분리하는 사람"]
    }
  ],
  daewoonTimeline: [
    {
      title: "정유대운",
      years: "현재-2036",
      note: "酉金을 써서 제도, 규율, 시스템, 서방/금속성 환경을 강화한다."
    },
    {
      title: "무술대운",
      years: "2036-2046",
      note: "건조한 土가 강해질 수 있어 현금흐름, 부채한도, 건강 루틴을 미리 구조화한다."
    },
    {
      title: "기해대운",
      years: "2046-2056",
      note: "亥水 진입. 학문, 이동, 글로벌 확장, 깊은 리서치의 운용 폭이 커진다."
    },
    {
      title: "경자대운",
      years: "2056-2066",
      note: "金水가 강해지는 구간. 제도권 권한과 지적 자산을 크게 쓰는 시기."
    }
  ],
  mandarat: [
    {
      title: "The One",
      items: ["법", "AI", "금융", "시뮬레이션", "글로벌 제도권", "가족", "문명", "자본"]
    },
    {
      title: "학업",
      items: ["학위 마무리", "AICPA FAR", "CFA L1", "영어", "일본어", "AI 기초", "퀀트", "논문 읽기"]
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
  transurfing: [
    "중요도는 ‘반드시 되어야 한다’는 과잉 압력이다. 목표는 보되, 실패하면 끝이라는 긴장은 낮춘다.",
    "욕망으로 세계를 밀어붙이지 않는다. 방향을 정하고, 내 역할의 작은 행동을 조용히 지불한다.",
    "슬라이드는 결과를 붙잡는 망상이 아니라 내가 자연스럽게 움직일 내면의 장면이다.",
    "장애물은 저주나 예언이 아니라 균형이 깨졌다는 신호다. 힘을 더 주기보다 중요도를 낮추고 경로를 조정한다.",
    "집착이 올라오면 결과·평판·타이밍을 놓고, 다음 15분의 가장 작은 실행으로 돌아온다."
  ],
  hill: [
    "명확한 목표를 매일 한 문장으로 읽는다.",
    "목표를 감정으로만 키우지 말고 오늘의 행동 하나로 바꾼다.",
    "반복 암시는 과학 엔진 위의 보조 장치로만 쓴다.",
    "신념은 검증과 실행을 통과할 때만 강화한다."
  ],
  woopDefault: {
    wish: "이번 주 핵심 시험/기술 트랙을 끊기지 않게 전진한다.",
    outcome: "학습 자존감과 현실 통제감이 회복된다.",
    obstacle: "밤샘, 과열, 완벽주의, 충동적 정보 소비.",
    plan: "만약 시작이 막히면 책상에서 타이머 15분만 켜고 첫 문제 하나만 푼다."
  }
};
