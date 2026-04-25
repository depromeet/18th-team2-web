---
name: qa
description: Vitest + Testing Library로 테스트를 작성하고 실행해 기능 동작을 검증합니다.
---

qa-engineer 에이전트를 사용해 대상 기능의 테스트를 작성하고 실행합니다.

다음 순서로 실행하세요:

1. 검증 대상 컴포넌트/훅/유틸 파악
2. 테스트 파일이 없으면 대상 파일과 같은 위치에 `*.test.tsx` / `*.test.ts` 생성
3. 아래 우선순위로 시나리오 작성:
   - 골든 패스 (정상 렌더 및 인터랙션)
   - 엣지 케이스 (빈 상태, 경계값)
   - 에러 시나리오 (API 실패, 로딩 상태)
4. `npm test` 실행 후 결과 확인
5. 실패 시 원인 분석 후 수정

## 테스트 환경

- **러너**: Vitest (`globals: true`, `environment: jsdom`)
- **컴포넌트**: `@testing-library/react` + `@testing-library/user-event`
- **매처**: `@testing-library/jest-dom` (setup.ts에서 자동 import)
- **모킹**: `vi.mock()` / `vi.fn()` / `vi.spyOn()`
- **커버리지**: `src/services/`, `src/utils/` ≥ 70% 목표

## 패턴 참고

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// API 모킹
vi.mock('@/services/api', () => ({
  api: { get: vi.fn() },
}));

// TanStack Query 래퍼
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  );
}

describe('ComponentName', () => {
  it('정상 데이터를 렌더한다', async () => {
    render(<Component />, { wrapper });
    expect(await screen.findByText('기대값')).toBeInTheDocument();
  });

  it('빈 상태를 처리한다', () => { ... });
  it('API 실패 시 에러를 표시한다', async () => { ... });
});
```

이슈가 발견되면 `.claude/docs/qa-YYYY-MM-DD-{기능명}.md`로 저장합니다.
