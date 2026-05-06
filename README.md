# Hyo Life OS

위효연 전용 Life OS 독립 프로젝트입니다.

## Boundary

- 이 폴더(`hyo-life-os/`)가 앞으로 Codex가 작업할 독립 앱 폴더입니다.
- `life-os/`는 다른 LLM 또는 다른 작업과 충돌할 수 있으므로 더 이상 수정하지 않습니다.
- UUID 폴더의 문서들은 참조 자료입니다. 앱 구현 파일은 이 폴더 안에서만 관리합니다.

## LLM Handoff

다른 컴퓨터나 다른 LLM이 이어받을 때는 GitHub repo를 clone한 뒤 아래 순서로 읽게 합니다.

1. `AGENTS.md`
2. `README.md`
3. `STATUS.md`
4. `LIVE_METHOD_MONITOR.md`
5. `docs/HANDOFF.md`
6. `docs/DECISIONS.md`
7. `docs/USER_GUIDE.md`

공개 repo에는 개발에 필요한 지침만 둡니다. 개인 입력 기록과 민감한 세부 맥락은 앱의 로컬 저장소 또는 암호화 백업으로 관리합니다.

## Run

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

Open:

```text
http://127.0.0.1:5183/
```

## Use Anywhere

이 앱은 정적 PWA라서 GitHub Pages, Cloudflare Pages, Netlify 같은 정적 호스팅에 올리면 어디서든 접속할 수 있습니다.

- 앱 코드에는 민감한 개인 상황 세부 명칭을 넣지 않습니다.
- 개인 입력 데이터는 서버가 아니라 각 기기의 `localStorage`에 저장됩니다.
- 여러 기기에서 같은 데이터를 쓰려면 `암호화 다운로드` 후 다른 기기에서 `암호화 가져오기`로 복원합니다.
- 공개 URL에 올리기 전 `js/data.js`에 민감 표현이 없는지 검색합니다.
- 가장 좋은 형태는 `웹에 올린 뒤 PWA로 설치`입니다. 즉, 앱스토어 앱보다 먼저 HTTPS 웹 배포가 우선입니다.

## Live Method Monitor

최신 논문, 공식 문서, 도구 변화를 주기적으로 감시하는 외부 모니터는 별도 레이어로 붙입니다.

- 설계 문서: `LIVE_METHOD_MONITOR.md`
- 알림 설정 문서: `docs/NOTIFICATIONS.md`
- 사용자 가이드: `docs/USER_GUIDE.md`
- v1 앱은 실행과 기록에 집중합니다.
- 모니터는 PubMed/OpenAlex/공식 문서/RSS를 주기적으로 확인하고 업데이트 후보를 만듭니다.
- 후보는 자동 반영하지 않고 주간/월간 리뷰에서 채택합니다.
- 진짜 백그라운드 알림은 정적 PWA만으로는 부족하고 Web Push 서버가 필요합니다.

## Current Stack

- Offline PWA
- Vanilla HTML/CSS/JS
- localStorage persistence
- JSON export/import
- Encrypted JSON export/import
- ChatGPT feedback Markdown export
- 5-stage console: Radar, Vision, Strategy, Today, Evolve
- Radar: world signals, method monitor, idea sandbox, skill forge
- Vision: The Slide, Ikigai, importance reduction, operating doctrine
- Strategy: Grand Plan, WOOP, Mandarat, weighted gaeun priorities
- Today: Morning Gate, TOP 3, core habits, Flow Matrix, Buddhist log, journal
- Evolve: weekly review, daewoon timeline, backup/security/settings
- Core 3 habits + guardrails
- Weekly trend bars
- Browser notification permission button
- Local app lock
- Evolve surface with security status, adaptive target editing, and deploy checklist
- Morning focus lock that blocks secondary tabs until the 60-second check-in is done
- Grand Plan editor with weekly update prompts and copyable review brief
- Live Method Monitor architecture document

## Isolation

- Service worker cache: `hyo-life-os-v1-10`
- localStorage key: `hyo-life-os-state-v1`
- Suggested dev port: `5183`
- App lock key: `hyo-life-os-lock-v1`

## Verify Before Deploy

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The verifier checks required PWA files, manifest parsing, service worker cache coverage, and sensitive public-support terms.

## Deploy To GitHub Pages

After GitHub CLI login:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-github-pages.ps1
```

Expected URL:

```text
https://buddhababe.github.io/hyo-life-os/
```
