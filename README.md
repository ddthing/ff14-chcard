# FF14 Character Card

> 한 명의 모험가를, 한 장의 카드로.

[서비스 열기](https://ff14-chcard.pages.dev/) · [사용 가이드](https://ff14-chcard.pages.dev/guide) · [FAQ](https://ff14-chcard.pages.dev/faq)

FF14 Character Card는 파이널 판타지 XIV 플레이어가 자신의 캐릭터와 플레이 스타일을 한 장의 프로필 카드로 정리하고 공유할 수 있도록 만든 브라우저 기반 도구입니다.

계정 없이 시작할 수 있고, 캐릭터 이미지는 브라우저 안에서 처리됩니다. 정보를 입력하고 디자인을 고른 뒤, 완성된 카드를 고화질 PNG로 저장하세요.

## 무엇을 만들 수 있나요?

- 캐릭터 이름, 서버, 지역, 활동 시간, 플레이 스타일을 담은 프로필 카드
- 주 직업과 직업별 레벨을 한눈에 보여주는 직업 정보
- 캐릭터 스크린샷 업로드, 자르기, 위치·크기 조정
- 스티커의 이동·확대·축소·회전과 키보드 미세 조정
- 색상, 폰트, 테마, 다크 모드를 활용한 카드 디자인
- 한국어, English, 日本語 인터페이스와 카드 콘텐츠
- 데스크톱과 모바일 화면에 맞춰지는 반응형 편집 화면
- 키보드 탐색, 포커스 관리, 스크린 리더용 상태 안내를 포함한 접근성 기능

## 사용 흐름

1. 캐릭터 기본 정보와 직업 정보를 입력합니다.
2. 스크린샷과 스티커를 배치하고 카드의 분위기를 조정합니다.
3. 오른쪽 미리보기에서 결과를 확인합니다.
4. **이미지 저장**을 눌러 PNG 파일로 내려받습니다.

카드 생성과 이미지 변환은 모두 사용자의 브라우저에서 수행됩니다.

## 설계 원칙

### Local first

서비스를 사용하기 위해 계정을 만들거나 서버에 캐릭터 이미지를 업로드할 필요가 없습니다. 편집 중인 프로필과 일부 설정은 브라우저의 `localStorage`에 저장되며, 브라우저 데이터를 지우면 초기화될 수 있습니다.

### Accessible by default

명확한 문서 구조, 건너뛰기 링크, 키보드 조작, 모달 포커스 관리, 상태 메시지, reduced-motion 대응을 기본 동작으로 다룹니다. 접근성은 별도의 부가 기능이 아니라 편집 경험의 일부입니다.

### Built to share

미리보기 화면과 내보내기 결과가 같은 카드 구조를 사용하도록 설계했습니다. 브라우저의 폰트 로딩과 이미지 캐시를 기다린 뒤 PNG를 생성해, 공유 가능한 결과물을 안정적으로 만드는 데 집중합니다.

## 기술 스택

- **UI**: React 19, React Router, TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4, 로컬 디자인 토큰 패키지
- **Motion**: Framer Motion
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
- **Production**: [ff14-chcard.pages.dev](https://ff14-chcard.pages.dev/)

자세한 설정은 [`DEPLOY.md`](./DEPLOY.md)를 참고하세요.

## 개인정보와 보안

- 업로드한 캐릭터 이미지는 이 애플리케이션의 서버로 전송하지 않습니다.
- 프로필과 일부 UI 설정은 브라우저의 `localStorage`에만 저장됩니다.
- 현재 애플리케이션에는 자체 백엔드, 데이터베이스, SQL 실행 코드가 없습니다.
- 따라서 현재 코드 기준으로 애플리케이션이 제공하는 SQL 인젝션 실행 경로는 없습니다.
- 선택한 웹 폰트는 성능을 위해 필요한 시점에 외부 CDN에서 로드될 수 있습니다. 폰트 제공자의 이용 조건과 라이선스는 각 제공자에게 귀속됩니다.

개인정보 처리에 관한 자세한 내용은 [개인정보처리방침](https://ff14-chcard.pages.dev/privacy)에서 확인할 수 있습니다.

## 오픈소스와 출처 표기

아래는 이 프로젝트가 직접 사용하는 주요 오픈소스입니다. 각 프로젝트의 라이선스와 원본 저장소를 함께 확인할 수 있습니다. 전체 의존성 목록은 `package.json`과 lockfile에서 확인할 수 있습니다.

`@ff14-glamour/design-system`은 이 저장소의 [`packages/design-system`](./packages/design-system)에서 관리하는 로컬 패키지이며, 제3자 오픈소스 라이브러리가 아닙니다.

### 애플리케이션 런타임

| 프로젝트 | 역할 | 라이선스 | 출처 |
| --- | --- | --- | --- |
| React / React DOM | UI 렌더링 | MIT | [facebook/react](https://github.com/facebook/react) |
| React Router | 클라이언트 라우팅 | MIT | [remix-run/react-router](https://github.com/remix-run/react-router) |
| Framer Motion | 인터랙션과 애니메이션 | MIT | [motiondivision/motion](https://github.com/motiondivision/motion) |
| html-to-image | 카드의 PNG 변환 | MIT | [bubkoo/html-to-image](https://github.com/bubkoo/html-to-image) |
| react-easy-crop | 이미지 자르기 | MIT | [ValentinH/react-easy-crop](https://github.com/ValentinH/react-easy-crop) |
| react-helmet-async | 문서 메타데이터 | Apache-2.0 | [staylor/react-helmet-async](https://github.com/staylor/react-helmet-async) |
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

서비스 안의 [문의하기](https://ff14-chcard.pages.dev/contact) 페이지에서 오류 제보와 개선 의견을 보내주세요.
