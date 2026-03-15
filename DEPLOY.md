# FF14 트친소 시트 생성기 — 배포 가이드

## 기술 스택
- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 7
- **스타일**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **주요 라이브러리**: `html-to-image`, `lucide-react`

---

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## 배포 방법

### 옵션 1: Vercel (추천 — 가장 간단)

1. [vercel.com](https://vercel.com) 가입 후 GitHub 연동
2. 프로젝트를 GitHub에 push
3. Vercel에서 "Import Project" → 레포지토리 선택
4. Framework Preset: **Vite** 자동 감지됨
5. "Deploy" 클릭 → 완료!

> 커스텀 도메인 연결도 Vercel 대시보드에서 바로 가능합니다.

### 옵션 2: Netlify

1. [netlify.com](https://netlify.com) 가입
2. "Sites" → "Add new site" → "Import an existing project"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### 옵션 3: GitHub Pages

1. `vite.config.ts`에 `base` 추가:
```ts
export default defineConfig({
  base: '/레포지토리-이름/',
  plugins: [react(), tailwindcss()],
})
```

2. 빌드 후 `dist` 폴더를 `gh-pages` 브랜치에 push:
```bash
npm run build
npx gh-pages -d dist
```

---

## 환경 변수

현재 환경 변수는 사용하지 않습니다. 모든 데이터는 클라이언트 사이드에서 처리됩니다.

---

## 폴더 구조 (빌드 결과)

```
dist/
├── index.html         ← 엔트리 포인트
├── assets/
│   ├── index-*.css    ← Tailwind + 커스텀 CSS 번들
│   └── index-*.js     ← React 앱 번들
└── icons/
    └── *.svg          ← 직업 아이콘 (public/ 에서 복사됨)
```
