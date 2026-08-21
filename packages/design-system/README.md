# @ff14-glamour/design-system

FF14 Glamour Maker의 색상, 다크 모드, typography, radius, shadow를 공유하는
CSS foundation 패키지입니다. 제품 전용 컴포넌트나 카드 markup은 포함하지 않습니다.

## Tailwind v4

전역 CSS에서 다음을 import합니다.

```css
@import "@ff14-glamour/design-system/theme.css";
```

Tailwind를 사용하지 않는 프로젝트에서는 `fonts.css`와 `tokens.css`를 각각
import할 수 있습니다. 다크 모드는 `html` 또는 상위 요소에 `dark` 클래스를
추가합니다.

이 저장소에서는 Cloudflare Pages가 동일한 저장소 안의 `packages/design-system`
패키지를 `file:` dependency로 설치합니다.
