import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'filled' | 'outlined' | 'active' | 'selected';

interface HighlightPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  filled:
    'bg-[linear-gradient(180deg,#3444F3_0%,#5B8AFC_70%)] text-white font-semibold tracking-[-0.0002em]',
  outlined:
    'bg-white text-head-2 font-medium text-grey-500 tracking-[-0.0001em] ring-1 ring-grey-300',
  active: 'bg-white text-grey-800 font-semibold tracking-[-0.0002em] ring-2 ring-blue-600',
  selected: 'bg-white text-grey-800 font-semibold tracking-[-0.0002em] ring-2 ring-blue-600',
};

export function HighlightPill({
  variant = 'filled',
  icon,
  children,
  className,
  type = 'button',
  ...props
}: HighlightPillProps) {
  const paddingClassName = icon ? 'px-3' : 'px-5';

  return (
    <button
      type={type}
      className={`inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full ${paddingClassName} align-middle whitespace-nowrap ${variant === 'outlined' ? '' : 'text-head-1'} ${variantStyles[variant]} ${className ?? ''}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
