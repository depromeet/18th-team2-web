# 컴포넌트 패턴

## 페이지 컴포넌트

모든 페이지는 `MobileLayout`으로 감쌉니다.

```tsx
// src/pages/LoginPage.tsx
import { MobileLayout } from '@/components/layout/MobileLayout';

function LoginPage() {
  return (
    <MobileLayout>
      <main className="flex flex-1 flex-col px-4 py-6">
        {/* 페이지 내용 */}
      </main>
    </MobileLayout>
  );
}

export default LoginPage;
```

`MobileLayout`은 `max-w-[600px]` 모바일 중앙 정렬 컨테이너입니다. 양 옆에 border, 바깥 배경은 흰색입니다.

## UI 컴포넌트

```tsx
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[variantClass[variant], sizeClass[size], className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
```

- UI 컴포넌트는 `named export`
- HTML 속성은 `extends React.[Element]HTMLAttributes`로 전부 통과 (`...props`)
- `className`은 항상 외부에서 오버라이드 가능하게

## 타이포그래피 컴포넌트

```tsx
import { T1, H1, B1, L1, Caption } from '@/components/ui/Typography';

// as prop으로 렌더 태그 변경
<T1 as="div" className="text-grey-900">제목</T1>
<B1 className="font-medium">본문</B1>
```

상세: `.claude/conventions/styling.md`

## 합성 (Composition) 패턴

```tsx
// ✅ 작은 단위로 쪼개기
function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <UserAvatar src={user.avatarUrl} name={user.name} />
      <UserInfo name={user.name} email={user.email} />
    </div>
  );
}

// ✅ children prop으로 유연하게
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white p-4 shadow ${className ?? ''}`}>{children}</div>;
}
```

## 상태 끌어올리기

```tsx
// ✅ 두 컴포넌트가 같은 상태를 공유할 때 → 부모로 올림
function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <SearchResults query={query} />
    </>
  );
}
```

## 금지 패턴

```tsx
// ❌ props drilling 3단계 이상 → Zustand 또는 Context 고려
<A prop={x}>
  <B prop={x}>
    <C prop={x} />
  </B>
</A>

// ❌ 컴포넌트 안에서 컴포넌트 정의
function Parent() {
  function Child() { return <div />; } // 매 렌더마다 재생성
  return <Child />;
}
```
