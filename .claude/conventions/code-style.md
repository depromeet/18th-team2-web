# 코드 스타일

## TypeScript

```ts
// ✅ 정확한 타입 사용
function getUser(id: string): Promise<User> { ... }

// ❌ any 금지
function getUser(id: any): Promise<any> { ... }

// ✅ unknown + 타입 가드
function parseResponse(data: unknown): User {
  if (!isUser(data)) throw new Error('Invalid user');
  return data;
}

// ✅ 타입 전용 import
import type { User } from '@/types/user';
import type { components } from '@/types/api';

// ✅ openapi-typescript 타입 활용
type User = components['schemas']['User'];
```

## 컴포넌트

```tsx
// ✅ named function declaration
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={`btn-${variant} ${className ?? ''}`} {...props} />;
}

// ✅ 페이지만 default export
export default function LoginPage() { ... }

// ❌ React.FC 금지
const Button: React.FC<ButtonProps> = ({ variant }) => { ... };

// ❌ 컴포넌트에 arrow function 금지 (최상위 export)
export const Button = ({ variant }: ButtonProps) => { ... };
```

## Import 순서

Prettier + ESLint가 자동 처리합니다. 수동으로 정렬하지 않아도 됩니다.

```ts
// 1. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// 2. 내부 모듈 (@/ alias)
import type { User } from '@/types/user';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
```

## 로깅

```ts
// ✅ 허용
console.warn('예상치 못한 상태:', state);
console.error('API 오류:', error);

// ❌ 커밋 금지
console.log('디버그:', data);
```

ESLint `no-console` 규칙이 `warn`/`error`만 허용합니다.

## 조건부 렌더링

```tsx
// ✅ boolean 변환 명시
{isLoading && <Spinner />}
{count > 0 && <List items={items} />}

// ❌ 숫자 0이 렌더될 수 있음
{count && <List items={items} />}

// ✅ null/undefined → 삼항 또는 optional chaining
{user ? <Profile user={user} /> : <Login />}
```

## 에러 처리

```ts
import { ApiError } from '@/services/api';

try {
  await api.post('/login', credentials);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) { /* 인증 실패 */ }
    if (error.status === 422) { /* 유효성 실패 */ }
  }
}
```
