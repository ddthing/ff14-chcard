# FF14 트친소 시트 생성기 — 유지보수 가이드

## 프로젝트 구조

```
src/
├── App.tsx                  ← 메인 앱 (상태 관리, localStorage, 다운로드)
├── index.css                ← 전역 스타일, 폰트, 다크모드
├── main.tsx                 ← 엔트리 포인트
├── types/index.ts           ← PlayerInfo, Job 등 타입 정의
├── data/
│   ├── jobs.ts              ← 직업 데이터 + 아이콘 경로
│   └── servers.ts           ← 서버/데이터센터 데이터
├── components/
│   ├── MainLayout.tsx       ← 2열 레이아웃 (폼 + 미리보기)
│   ├── CardForm.tsx         ← 입력 폼 (직업, 서버, 레벨 등)
│   ├── CardPreview.tsx      ← 카드 미리보기 (PNG 생성 대상)
│   └── ThemeToggle.tsx      ← 라이트/다크 전환 버튼
└── hooks/                   ← (커스텀 훅 — 현재 미사용)
```

---

## 자주 하는 작업

### 직업 추가
1. `src/data/jobs.ts`의 `JOBS` 배열에 새 항목 추가
2. `public/icons/`에 해당 직업의 SVG 아이콘 추가
3. `iconUrl`을 `/icons/직업이름.svg` 형식으로 지정

### 서버 추가/수정
`src/data/servers.ts`에서 `DATA_CENTERS`와 `WORLDS` 수정

### 폰트 추가
1. `src/index.css`에 `@font-face` 규칙 추가
2. `.font-이름 { font-family: '폰트명' !important; }` 클래스 추가
3. `src/components/CardForm.tsx`의 폰트 목록 배열에 추가

### 플레이스타일 태그 추가
`src/data/jobs.ts`의 `PLAYSTYLES` 배열에 항목 추가

---

## 다크모드 동작 방식
- `ThemeToggle`이 `<html>` 요소에 `dark` 클래스를 토글
- Tailwind v4의 `@custom-variant dark` 사용
- `localStorage`에 `theme` 키로 저장됨

## 데이터 저장 방식
- 폼 데이터는 `localStorage`에 `ff14-playerInfo` 키로 자동 저장
- **이미지는 제외** (base64 크기 이슈 방지)
- 새로고침 시 자동 복원

## PNG 내보내기
- `html-to-image` 라이브러리의 `toPng()` 사용
- `pixelRatio: 2`로 고해상도 출력
- 다크모드 감지하여 배경색 자동 분기
