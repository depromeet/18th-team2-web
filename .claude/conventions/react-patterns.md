# React 패턴

## 훅 사용 원칙

```ts
// ✅ 서버 상태 → TanStack Query (services/에 위치)
const { data: users, isLoading } = useUsers();

// ✅ 클라이언트 상태 → Zustand
const { isAuthenticated, login } = useAuthStore();

// ✅ 로컬 UI 상태 → useState
const [isOpen, setIsOpen] = useState(false);

// ❌ useEffect로 fetch 금지
useEffect(() => {
  fetch('/api/users').then(/* ... */);
}, []);
```

## 데이터 로딩 패턴

```tsx
export function UserList() {
  const { data: users, isLoading, isError, error } = useUsers();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <ul>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ul>
  );
}
```

## Mutation 패턴

```tsx
export function CreateUserForm() {
  const { mutate: createUser, isPending } = useCreateUser();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createUser({ name: form.get('name') as string });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}
```

## 이벤트 핸들러

```tsx
// ✅ 함수 선언으로 분리
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  // ...
}

// ✅ 간단한 경우만 인라인
<button onClick={() => setIsOpen(false)}>닫기</button>

// ❌ 복잡한 로직 인라인 금지
<button onClick={() => { /* 10줄 이상 로직 */ }}>제출</button>
```

## 조건부 렌더링

```tsx
// ✅ boolean 변환 명시적으로
{items.length > 0 && <List items={items} />}

// ✅ 삼항 연산자 (두 분기가 명확할 때)
{isLoggedIn ? <Dashboard /> : <Login />}

// ✅ 얼리 리턴 (복잡한 분기)
if (isLoading) return <Spinner />;
if (!data) return null;
return <Content data={data} />;
```

## 커스텀 훅 (`src/hooks/`)

서버 상태와 무관한 순수 클라이언트 로직만 작성합니다.

```ts
// ✅ src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ❌ src/hooks/에 서버 상태 훅 금지
// → src/services/user.ts 에 위치해야 함
export function useUsers() {
  return useQuery(userQueries.all());
}
```
