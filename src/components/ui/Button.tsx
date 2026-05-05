import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white' | 'white-blue' | 'ghost';
  size?: 'full' | 'lg' | 'md' | 'sm';
  leftIcon?: ReactNode;
}

const sizeStyles = {
  full: 'h-14 w-full rounded-btn-lg',
  lg: 'h-12 rounded-btn-lg px-7 py-3',
  md: 'h-[46px] rounded-btn-md px-7 py-3',
  sm: 'h-9 rounded-btn-sm px-5 py-2',
} as const;

const variantStyles = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-grey-50 text-grey-300',
  white: 'bg-white text-grey-800',
  'white-blue': 'border border-blue-200 bg-white text-blue-600',
  ghost: 'border border-white/60 text-white',
} as const;

export function Button({
  variant = 'primary',
  size = 'full',
  leftIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`text-body-1 disabled:bg-grey-50 disabled:text-grey-300 inline-flex cursor-pointer items-center justify-center gap-2 font-semibold disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className ?? ''}`}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
