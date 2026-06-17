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

### Cloudflare Pages 배포 (현재 사용 환경)

현재 이 프로젝트는 `https://ff14-chcard.pages.dev/` 로 배포되어 있습니다. Cloudflare Pages를 통해 GitHub 레포지토리 자동 배포를 이용하시면 됩니다.

1. [Cloudflare 대시보드](https://dash.cloudflare.com/) 로그인 후 "Pages" 이동
2. "Connect to Git" → GitHub 레포지토리 연동
3. 빌드 설정:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy!

> **참고**: SPA(Single Page Application) 라우팅을 위해 `public/_redirects` 파일이 배포 시 자동으로 처리됩니다.

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
