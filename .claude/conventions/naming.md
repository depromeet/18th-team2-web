# 네이밍 컨벤션

## 파일명

| 종류 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 | PascalCase | `Button.tsx`, `MobileLayout.tsx` |
| 페이지 | PascalCase + `Page` | `LoginPage.tsx`, `HomePage.tsx` |
| 훅 | camelCase + `use` 접두사 | `useDebounce.ts`, `useMediaQuery.ts` |
| 서비스 | camelCase (도메인명) | `user.ts`, `auth.ts` |
| Zustand 스토어 | camelCase + `use` + `Store` | `useAuthStore.ts`, `useUIStore.ts` |
| 유틸 | camelCase | `formatDate.ts`, `validators.ts` |
| 타입 | camelCase | `user.ts`, `common.ts` |
| 상수 | camelCase | `routes.ts`, `query-keys.ts` |

## 컴포넌트 & Props

```ts
// 컴포넌트: PascalCase named function declaration
export function UserCard({ name, avatar }: UserCardProps) { ... }

// Props 인터페이스: [ComponentName]Props
interface UserCardProps {
  name: string;
  avatar?: string;
}
```

## 변수 & 함수

```ts
// 변수, 함수: camelCase
const userName = 'Alice';
function formatDate(date: Date): string { ... }

// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const APP_NAME = '18th-team2-web';

// 타입/인터페이스/Enum: PascalCase
type UserRole = 'admin' | 'user';
interface ApiResponse<T> { data: T; }
```

## 함수 네이밍 원칙

**"무엇을 하는가"가 이름에서 바로 드러나야 합니다.**

### 동사 + 목적어

```ts
// ✅ 무엇을 하는지 명확
function fetchUserProfile(userId: string) { ... }
function validateEmailFormat(email: string) { ... }
function formatCurrency(amount: number) { ... }
function calculateTotalPrice(items: CartItem[]) { ... }

// ❌ 너무 모호
function getData() { ... }
function process() { ... }
function handle() { ... }
function util() { ... }
```

### 반환값이 boolean인 함수 — `is` / `has` / `can` 접두사

```ts
// ✅
function isValidEmail(email: string): boolean { ... }
function hasPermission(user: User, action: string): boolean { ... }
function canSubmitForm(form: FormState): boolean { ... }

// ❌
function checkEmail(email: string): boolean { ... }
function permission(user: User): boolean { ... }
```

### 축약어 금지 — 풀어서 쓰기

```ts
// ✅
const userAuthenticated = true;
function getUserProfile() { ... }

// ❌
const usrAuth = true;
function getUsrProf() { ... }
```

### 동사 선택 기준

| 상황 | 사용할 동사 |
| --- | --- |
| API 호출 (비동기) | `fetch`, `load` |
| 로컬 데이터 가공 | `get`, `find`, `filter`, `calculate`, `format` |
| 상태 변경 | `set`, `update`, `reset`, `toggle` |
| 생성/추가 | `create`, `add`, `append` |
| 삭제 | `remove`, `delete`, `clear` |
| 검증 | `validate`, `check` → `is*` / `has*` |

## 훅

```ts
// 반환값이 단일 값이면 그대로, 여러 값이면 객체로
function useCounter() {
  return count; // 단일값
}

function useModal() {
  return { isOpen, open, close }; // 여러값
}
```

## TanStack Query 키

```ts
// 배열 구조: ['도메인', ...params]
queryKey: ['users']
queryKey: ['users', userId]
queryKey: ['users', userId, 'posts']
```

## 이벤트 핸들러

```ts
// on + 동사 형태
const handleSubmit = () => { ... };
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };

// Props로 전달 시
<Button onClick={handleSubmit} />
<Input onChange={handleInputChange} />
```
