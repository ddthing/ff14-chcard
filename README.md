# FF14 Character Card

> 한 명의 모험가를, 한 장의 카드로.

[서비스 열기](https://ccard.ffxiv.world/) · [사용 가이드](https://ccard.ffxiv.world/guide) · [FAQ](https://ccard.ffxiv.world/faq)

FF14 Character Card는 파이널 판타지 XIV 플레이어가 자신의 캐릭터와 플레이 스타일을 한 장의 프로필 카드로 정리하고 공유할 수 있도록 만든 브라우저 기반 도구입니다.

계정 없이 시작할 수 있고, 캐릭터 이미지는 브라우저 안에서 처리됩니다. 정보를 입력하고 디자인을 고른 뒤, 완성된 카드를 고화질 PNG로 저장하세요.

## 스튜디오 업데이트

- 크림색 종이와 짙은 잉크색을 바탕으로 헤더·편집 패널·미리보기·문서 도구줄을 재설계했습니다. 데스크톱에서는 작업을 한 화면에 유지하고 모바일에서는 기존 3단 편집 패널을 사용합니다.
- **시그니처 스타일 4종**: 에디토리얼, 녹턴, 보타니카, 아카이브. 컬러·폰트·사진 구도·배경 효과를 한 번에 적용합니다. 사진·프로필·직업·스티커는 유지되며 실행 취소 한 번으로 이전 스타일로 돌아갑니다.
- **집중 보기**: 데스크톱 편집 패널을 접고 카드를 크게 확인할 수 있습니다. 같은 버튼이나 `Esc`로 돌아오며, PNG 출력 크기는 바뀌지 않습니다.
- **작업 배경 전환과 배치 바로가기**: 카드의 밝기를 확인할 때 작업 배경만 어둡게 바꿀 수 있고, 미리보기 아래에서 가로·세로 배치를 전환할 수 있습니다.
- 스티커 포인터 이벤트를 화면 프레임당 한 번으로 모으고, 변하지 않은 좌표 갱신과 불필요한 사진 크기 측정을 생략합니다. 놓기 직전 위치와 취소 시 원래 위치는 보존합니다.
- 원본 PNG 인코딩이 끝나면 대형 캔버스 메모리를 반환합니다. 원본 해상도 업로드·저장과 기존 프로필 저장 형식은 유지합니다.

추가한 UI는 한국어·영어·일본어, 키보드 조작, 동작 줄이기 설정을 지원합니다.

## 무엇을 만들 수 있나요?

- 캐릭터 이름, 서버, 지역, 활동 시간, 플레이 스타일을 담은 프로필 카드
- 주 직업과 직업별 레벨을 한눈에 보여주는 직업 정보
- 캐릭터 스크린샷 업로드, 자르기, 위치·크기 조정
- 실제 파일 읽기 진행·취소·재시도, 새 파일 선택 시 이전 읽기 취소. 읽기가 끝나면 크롭 창으로 전환하며 완료 표시를 사진 위에 남기지 않습니다. 사진이 있으면 업로드 상자 대신 썸네일·변경·삭제를 표시합니다. [Lucian UX/UI #032](https://lucianlabs.dev/uxui-prompt/#032)을 브라우저의 이미지 처리에 연결했습니다.
- 스티커의 이동·확대·축소·회전과 키보드 미세 조정
- [Lucian UX/UI #122](https://lucianlabs.dev/uxui-prompt/#122) 기반 스티커 레이어와 선택한 항목의 설정. 선택 자체는 쌓임 순서를 바꾸지 않습니다.
- 선택한 스티커의 ⋯ 또는 우클릭으로 앞뒤 순서·가운데 정렬·변형 초기화·삭제를 실행하는 [Lucian UX/UI #038](https://lucianlabs.dev/uxui-prompt/#038) 메뉴
- 색상, 폰트, 테마, 다크 모드를 활용한 카드 디자인
- 한국어, English, 日本語 인터페이스와 카드 콘텐츠
- 공통 도구줄의 실행 취소·자동 저장 상태·PNG 저장과, 설정 옆에 미리보기를 유지하는 데스크톱 작업 화면
- 모바일에서 미리보기를 보며 접힘·절반·전체 높이로 펼치는 편집 패널. [Lucian UX/UI #336](https://lucianlabs.dev/uxui-prompt/#336)의 끌기·키보드 높이 조절을 실제 편집 폼에 연결했습니다.
- 기본·직업·스타일·꾸미기·스티커·보관함을 분리하고 편집 항목별 스크롤 위치를 기억합니다.
- 접고 펼칠 수 있는 편집 레일과 좁은 화면의 가로 메뉴. [Lucian UX/UI #040](https://lucianlabs.dev/uxui-prompt/#040)을 실제 편집 항목에 연결했습니다.
- ‘사용방법’을 누르면 사진·기본 정보·직업·스타일·꾸미기·스티커·미리보기·저장을 실제 화면에서 따라가는 8단계 안내가 열립니다. [Lucian UX/UI #197](https://lucianlabs.dev/uxui-prompt/#197) 기반이며, Esc나 닫기로 끝내면 원래 편집 항목으로 돌아옵니다.
- 기존 사진 배치를 유지한 가로형 700px·세로형 880px 카드. 높이는 내용에 따라 늘어납니다.
- 주 직업은 포인트 색을 입힌 아이콘, 이름과 레벨로 강조하며, 전투 직업의 마수조련사는 마지막에 표시합니다. 마수조련사 최대 레벨 50·청마도사 80·나머지 직업 100을 지원합니다.
- 직업 목록은 아이콘·레벨만 조밀하게 배열하고, 직업명은 툴팁과 스크린 리더에 제공합니다.
- 순백색 라이트 카드, 다크 카드, 옅은 포인트 색의 주 직업 영역·플레이스타일 태그, 실제 배경에 맞춘 글자·아이콘 명도 보정
- 생성형 종이·잉크 이미지 질감과 각각 선택할 수 있는 모서리 색 번짐·주 직업 워터마크. [텍스처 출처](./public/textures/README.md)
- 다섯 색 팔레트의 개별 잠금·새로 섞기·포인트색 선택, 직접 HEX 입력·복사, 키보드 폰트 선택. [Lucian UX/UI #266](https://lucianlabs.dev/uxui-prompt/#266)을 기존 테마와 실제 카드 미리보기에 맞게 연결했습니다.
- 폰트 목록의 방향키·Home/End·글자 입력 탐색과 확정 선택. [Lucian UX/UI #031](https://lucianlabs.dev/uxui-prompt/#031)을 세 언어의 폰트 목록에 연결했습니다.
- 저장 진행·완료·오류와 색상 복사 결과를 모아 보여주는 [Lucian UX/UI #070](https://lucianlabs.dev/uxui-prompt/#070) 알림. 알림을 펼치거나 개별로 닫을 수 있고, 마우스를 올리거나 초점을 두면 자동 닫힘이 멈춥니다.
- 전체 카드 보기·너비 맞춤·실제 크기 미리보기, 원본 해상도·1×·2×·3× PNG 저장과 실제 출력 해상도 표시
- 출력 배율과 저장을 묶은 [Lucian UX/UI #010](https://lucianlabs.dev/uxui-prompt/#010) 분할 버튼. 화살표에서 옵션을 고르고 주 버튼으로 PNG를 저장합니다.
- 30단계 실행 취소·다시 실행. 연속 입력을 묶고 색상 선택을 되돌리며, 입력칸 밖에서 Ctrl/⌘ Z·Ctrl/⌘ Shift Z를 지원합니다. 기록은 현재 세션에만 보관됩니다.
- 데스크톱과 모바일 화면에 맞춰지는 반응형 편집 화면
- 키보드 탐색, 포커스 관리, 스크린 리더용 상태 안내를 포함한 접근성 기능

## 사용 흐름

1. 캐릭터 기본 정보와 직업 정보를 입력합니다.
2. 스크린샷과 스티커를 배치하고 카드의 분위기를 조정합니다.
3. 미리보기에서 결과를 확인합니다. 모바일에서는 편집 패널의 손잡이로 높이를 바꿔 카드를 보면서 조절할 수 있습니다.
4. 도구줄에서 출력 해상도를 확인하고 PNG 저장 버튼을 누릅니다. 옆 화살표를 열면 저장 품질을 고를 수 있습니다. 기본 ‘원본 해상도’는 카드 안 사진의 원래 픽셀 밀도에 맞춰 전체 카드를 저장합니다. 1·2·3배 저장도 선택할 수 있으며, 이 배율 옵션의 큰 출력만 1,200만 픽셀·한 변 16,384px 이내로 자동 조정됩니다.

카드 생성과 이미지 변환은 모두 사용자의 브라우저에서 수행됩니다.

캐릭터 이미지에는 파일 용량이나 3000px 해상도 제한을 두지 않습니다. 업로드한 파일은 원래 형식과 해상도로 읽고, 선택한 크롭 영역도 원본 픽셀 크기의 무손실 PNG로 처리합니다. ‘원본 해상도’ 저장은 자동 축소 없이 PNG로 출력하며, 기기에서 해독하거나 저장할 수 없는 이미지는 오류로 안내합니다. 프로필과 보관함의 원본 이미지는 IndexedDB에 저장합니다. 실제 저장 실패 시에도 현재 편집과 PNG 저장은 계속할 수 있으며, 도구줄 아래 안내에서 JSON 백업을 열 수 있습니다.

## 설계 원칙

### Local first

서비스를 사용하기 위해 계정을 만들거나 서버에 캐릭터 이미지를 업로드할 필요가 없습니다. 편집 중인 프로필과 보관함은 브라우저의 `IndexedDB`에, 일부 화면 설정과 작은 복구 정보는 `localStorage`에 저장되며, 브라우저 데이터를 지우면 초기화될 수 있습니다.

### Accessible by default

명확한 문서 구조, 건너뛰기 링크, 키보드 조작, 모달 포커스 관리, 상태 메시지, reduced-motion 대응을 기본 동작으로 다룹니다. 접근성은 별도의 부가 기능이 아니라 편집 경험의 일부입니다.

### Built to share

미리보기 화면과 내보내기 결과가 같은 카드 구조를 사용하도록 설계했습니다. 브라우저의 폰트 로딩과 이미지 캐시를 기다린 뒤 PNG를 생성해, 공유 가능한 결과물을 안정적으로 만드는 데 집중합니다.

## 기술 스택

- **UI**: React 19, React Router, TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4, 로컬 디자인 토큰 패키지
- **Motion**: CSS transitions and requestAnimationFrame
- **Icons**: Lucide React
- **Image export**: html-to-image
- **Image crop**: react-easy-crop
- **Metadata**: react-helmet-async

## 로컬에서 실행하기

### 요구 사항

- Node.js `20.19+` 또는 `22.12+`
- npm

### 시작

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 사용 가능한 명령

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | TypeScript 검사 후 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run preview` | 프로덕션 빌드 결과 로컬 확인 |
| `npm run test:e2e` | Chromium 기능·접근성·PNG 출력 회귀 검사 |

이미 실행 중인 개발 서버로 검사할 때는 `PLAYWRIGHT_BASE_URL`을 해당 로컬 URL로 지정할 수 있습니다. 설치된 Chromium 계열 브라우저는 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`에 실행 파일 경로를 지정해 사용합니다.

## 저장소 구조

```text
src/
├── components/       화면과 편집 UI
├── components/form/  프로필 입력 섹션
├── components/preview/ 카드 미리보기
├── contexts/         프로필 상태와 브라우저 저장소 연동
├── data/              직업·서버 데이터
├── hooks/             이미지 내보내기·폰트·상호작용 로직
├── pages/             홈, 가이드, FAQ, 약관·정책 페이지
├── utils/             다국어, 메타데이터, 이미지·스타일 유틸리티
└── types/             공용 TypeScript 타입

packages/
└── design-system/    색상·타이포그래피·간격 토큰과 공용 CSS

public/
└── icons/             직업 아이콘과 정적 에셋
```

## 배포

운영 사이트는 Cloudflare Pages에서 GitHub 저장소와 연결해 배포합니다.

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Production**: [ccard.ffxiv.world](https://ccard.ffxiv.world/)

자세한 설정은 [`DEPLOY.md`](./DEPLOY.md)를 참고하세요.

## 개인정보와 보안

- 업로드한 캐릭터 이미지는 이 애플리케이션의 서버로 전송하지 않습니다.
- 프로필과 보관함은 브라우저의 `IndexedDB`에 저장합니다. 기존 `localStorage` 데이터는 저장이 확인된 뒤 이전하며, 화면 설정과 작은 복구 정보는 `localStorage`를 사용합니다.
- 현재 애플리케이션에는 자체 백엔드, 데이터베이스, SQL 실행 코드가 없습니다.
- 따라서 현재 코드 기준으로 애플리케이션이 제공하는 SQL 인젝션 실행 경로는 없습니다.
- 선택한 웹 폰트는 성능을 위해 필요한 시점에 외부 CDN에서 로드될 수 있습니다. 폰트 제공자의 이용 조건과 라이선스는 각 제공자에게 귀속됩니다.

개인정보 처리에 관한 자세한 내용은 [개인정보처리방침](https://ccard.ffxiv.world/privacy)에서 확인할 수 있습니다.

## 오픈소스와 출처 표기

아래는 이 프로젝트가 직접 사용하는 주요 오픈소스입니다. 각 프로젝트의 라이선스와 원본 저장소를 함께 확인할 수 있습니다. 전체 의존성 목록은 `package.json`과 lockfile에서 확인할 수 있습니다.

`@ff14-glamour/design-system`은 이 저장소의 [`packages/design-system`](./packages/design-system)에서 관리하는 로컬 패키지이며, 제3자 오픈소스 라이브러리가 아닙니다.

### 애플리케이션 런타임

| 프로젝트 | 역할 | 라이선스 | 출처 |
| --- | --- | --- | --- |
| React / React DOM | UI 렌더링 | MIT | [facebook/react](https://github.com/facebook/react) |
| React Router | 클라이언트 라우팅 | MIT | [remix-run/react-router](https://github.com/remix-run/react-router) |
| html-to-image | 카드의 PNG 변환 | MIT | [bubkoo/html-to-image](https://github.com/bubkoo/html-to-image) |
| react-easy-crop | 이미지 자르기 | MIT | [ValentinH/react-easy-crop](https://github.com/ValentinH/react-easy-crop) |
| react-helmet-async | 문서 메타데이터 | Apache-2.0 | [staylor/react-helmet-async](https://github.com/staylor/react-helmet-async) |
| Lucian UX/UI Prompt | 팔레트·편집 레일·화면 안내·업로드·알림·폰트 선택·모바일 패널·레이어·컨텍스트 메뉴·출력 버튼 | MIT · Copyright 2026 Seokwoooo | [Lucian UX/UI](https://lucianlabs.dev/uxui-prompt/) · [고지](./LICENSES/lucian-uxui.txt) |
| Lucide React | 인터페이스 아이콘 | ISC | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) |
| `clsx` | 조건부 클래스 조합 | MIT | [lukeed/clsx](https://github.com/lukeed/clsx) |
| `tailwind-merge` | Tailwind 클래스 병합 | MIT | [dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge) |

### 개발·빌드 도구

| 프로젝트 | 역할 | 라이선스 | 출처 |
| --- | --- | --- | --- |
| Vite / `@vitejs/plugin-react` | 개발 서버와 번들링 | MIT | [vitejs/vite](https://github.com/vitejs/vite), [vite-plugin-react](https://github.com/vitejs/vite-plugin-react) |
| TypeScript | 정적 타입 검사 | Apache-2.0 | [microsoft/TypeScript](https://github.com/microsoft/TypeScript) |
| Tailwind CSS / `@tailwindcss/vite` | 스타일 시스템 | MIT | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) |
| PostCSS / Autoprefixer | CSS 변환 | MIT | [postcss/postcss](https://github.com/postcss/postcss), [postcss/autoprefixer](https://github.com/postcss/autoprefixer) |
| ESLint / `typescript-eslint` | 코드 품질 검사 | MIT | [eslint/eslint](https://github.com/eslint/eslint), [typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) |
| DefinitelyTyped | TypeScript 타입 정의 | MIT | [DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |

간접 의존성의 전체 목록은 [`package-lock.json`](./package-lock.json)에 기록되어 있습니다. 소스 코드나 번들 형태로 재배포할 때는 각 프로젝트의 라이선스 고지 조건을 유지해야 합니다.

### 웹 폰트

선택 가능한 웹 폰트는 [`src/hooks/useFontLoader.ts`](./src/hooks/useFontLoader.ts)에 기록된 CDN 주소에서 지연 로드됩니다. 폰트 파일 자체의 저작권과 사용 조건은 각 제작자에게 있습니다.

- [눈누 / Project Noonnu](https://noonnu.cc/)
- [Project Noonnu GitHub](https://github.com/projectnoonnu)
- [Mona](https://github.com/MonadABXY/mona-font)
- [Galmuri](https://github.com/quiple/galmuri)

폰트를 별도 파일로 재배포하거나 다른 프로젝트에 포함할 때는 해당 폰트의 개별 라이선스를 먼저 확인하세요.

## 게임 에셋과 상표

FINAL FANTASY XIV, FFXIV, 관련 직업 아이콘과 게임 에셋의 권리는 SQUARE ENIX CO., LTD.에 있습니다. 이 프로젝트는 SQUARE ENIX 또는 ACTOZ SOFT와 공식적인 제휴·승인 관계가 없는 비공식 팬 프로젝트입니다.

이 README의 오픈소스 고지는 게임 에셋이나 상표를 재사용할 권리를 부여하지 않습니다. 게임 에셋의 이용은 해당 권리자의 정책과 가이드라인을 따라야 합니다.

## 문의와 피드백

서비스 안의 [문의하기](https://ccard.ffxiv.world/contact) 페이지에서 오류 제보와 개선 의견을 보내주세요.

## 재구성 및 검증 안내

이 버전은 이전 실행 환경과 ZIP에 접근할 수 없어진 뒤, 대화에 기록된 요구사항과 변경 내역을 바탕으로 원격 기준 커밋 `6477264`에서 재구성했습니다. 이전 로컬 커밋 `70a4613`과 완전히 같은 파일·Git 이력을 복구한 것은 아닙니다. 종이·잉크 텍스처는 같은 용도로 새로 생성했고, 마수조련사 SVG도 같은 게임 문양에서 다시 추출했습니다.

`npm run test:e2e`는 두 레이아웃 × 세 언어의 긴 내용·전체 직업·라이트/다크 대비와 잘림, 12가지 실제 PNG 해상도, 사진 보존·배경 효과·종이결·아이콘 잉크결, 선택된 스티커 저장, 실행 취소·분기·스티커 복구, 미리보기 맞춤·실제 크기 스크롤, 모바일 넘침, 폰트·탭 키보드 탐색, 이미지 자르기 포커스, JSON 백업과 파일 검증을 확인합니다. 시스템 Chromium이 `/usr/bin/chromium`에 있으면 자동 사용합니다. 없으면 `npx playwright install chromium`으로 설치하세요.

브라우저 검사는 외부 CDN 폰트를 차단한 Chromium 기준입니다. 실제 폰트 CDN 성능·실기기 Safari·Firefox 및 전체 WCAG 적합성을 보증하지 않습니다. WebKit에서는 이미지 준비를 위한 추가 저장 단계를 유지하고, Chromium에서는 중복 캡처를 줄였습니다.

Cloudflare Pages는 해시가 있는 `/assets/*`만 1년 immutable로 캐시하고, 아이콘·텍스처는 1시간, 루트 HTML은 재검증합니다. 이 설정의 CDN 응답은 배포 후 확인해야 합니다. 사이트 주소는 `https://ccard.ffxiv.world`로 통일했습니다.
