import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'filled' | 'outlined' | 'active' | 'selected';

interface HighlightPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  filled:
    'bg-[radial-gradient(50%_50%_at_50%_50%,#3D7AE9_0%,#6174FF_100%)] text-white font-semibold tracking-[-0.0002em]',
  outlined: 'border border-grey-50 bg-white text-head-2 font-medium text-grey-600 tracking-[-0.0001em]',
  active: 'border-2 border-blue-600 bg-white text-grey-800 font-semibold tracking-[-0.0002em]',
  selected: 'border border-blue-500 bg-white text-grey-800 font-semibold tracking-[-0.0002em]',
};

export function HighlightPill({
  variant = 'filled',
  children,
  className,
  type = 'button',
  ...props
}: HighlightPillProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 align-middle whitespace-nowrap ${variant === 'outlined' ? '' : 'text-head-1'} ${variantStyles[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
