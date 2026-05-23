import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'white'
    | 'white-blue'
    | 'white-grey'
    | 'ghost'
    | 'link-white'
    | 'link-primary';
  size?: 'full' | 'lg' | 'md' | 'sm';
  leftIcon?: ReactNode;
  buttonRef?: Ref<HTMLButtonElement>;
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
  danger: 'bg-red-30 text-red-500',
  white: 'bg-white text-grey-900',
  'white-blue': 'border border-blue-200 bg-white text-blue-600',
  'white-grey': 'border border-grey-100 bg-white text-grey-900',
  ghost: 'border border-white/60 text-white',
  'link-white':
    'h-auto text-label-1 w-fit rounded-none bg-transparent p-0 text-white underline underline-offset-2',
  'link-primary':
    'h-auto text-label-1 w-fit rounded-none bg-transparent p-0 text-blue-600 underline underline-offset-2',
} as const;

export function Button({
  variant = 'primary',
  size = 'full',
  leftIcon,
  className,
  children,
  buttonRef,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={buttonRef}
      className={`text-body-1 disabled:bg-grey-50 disabled:text-grey-300 inline-flex cursor-pointer items-center justify-center gap-2 font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className ?? ''}`}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
