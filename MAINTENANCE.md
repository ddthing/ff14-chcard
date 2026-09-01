# FF14 캐릭터 카드 생성기 — 유지보수 가이드

## 주요 구조

- `src/contexts/PlayerContext.tsx`: 편집 상태, 자동 저장, 스티커 선택·삭제 복구
- `src/utils/playerData.ts`: localStorage와 백업 데이터의 검증·마이그레이션
- `src/components/CardForm.tsx`: 탭 기반 입력 폼과 모바일 이미지 업로드
- `src/components/CardPreview.tsx`: PNG 생성 대상 카드와 스티커 직접 조작
- `src/components/form/SlotSection.tsx`: 프로필 슬롯 저장과 JSON 백업
- `src/hooks/useImageExport.ts`: PNG 렌더링 및 다운로드
- `src/hooks/useFontLoader.ts`: 선택한 웹 폰트만 동적으로 로드
- `src/utils/i18n.ts`: 한국어·영어·일본어 UI 문구

## 데이터 호환성

- 프로필은 `ff14-playerInfo`, 슬롯은 `ff14-chcard-slots`에 저장됩니다.
- 스키마 변경 시 `PROFILE_SCHEMA_VERSION`을 올리고 `normalizePlayerInfo()`에서 이전 값을 보존·변환합니다.
- 저장소나 백업의 `JSON.parse()` 결과를 `PlayerInfo`로 직접 단언하지 않습니다.
- 필드나 폰트 ID를 제거하기 전에 정규화 단계에서 안전한 값으로 치환합니다.

## 자주 하는 작업

### 직업 또는 서버 갱신

- 직업: `src/data/jobs.ts`와 `public/icons/`
- 서버/데이터센터: `src/data/servers.ts`
- 세 언어 표시명과 가이드 통계를 함께 확인합니다.

### 폰트 추가

1. `src/utils/i18n.ts`의 세 언어 폰트 목록에 같은 ID를 추가합니다.
2. `src/hooks/useFontLoader.ts`에 `@font-face`를 추가합니다.
3. `src/index.css`에 카드 미리보기 폰트 클래스를 추가합니다.
4. `src/utils/playerData.ts`의 허용 폰트 ID에도 추가합니다.

## 접근성 체크

- 기능은 키보드만으로 실행·취소할 수 있어야 합니다.
- 전역 키보드 단축키 대신 대상 컨트롤에 포커스가 있을 때만 처리합니다.
- 사용자 지정 포인트 색을 작은 본문 글자색으로 직접 사용하지 않습니다.
- 모달은 포커스를 가두고 닫은 뒤 실행 버튼으로 돌려보냅니다.
- 저장·가져오기·비동기 처리 결과는 화면과 라이브 리전에 함께 알립니다.
- 애니메이션은 `prefers-reduced-motion`을 지원해야 합니다.

## 검증

```bash
npm run lint
npm run build
```

브라우저에서는 탭 순서, 스티커 방향키 이동/삭제, 이미지 크롭 포커스 복귀, 슬롯 백업 복구, 200% 확대와 모바일 레이아웃을 확인합니다.
