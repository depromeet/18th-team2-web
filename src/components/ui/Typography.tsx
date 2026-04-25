import type { ElementType, HTMLAttributes } from 'react';

interface TypoProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

function cls(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

// Title (36 / 32 / 28 / 24px)
export function T1({ as: Tag = 'h1', className, ...props }: TypoProps) {
  return <Tag className={cls('text-title-1 font-bold', className)} {...props} />;
}

export function T2({ as: Tag = 'h2', className, ...props }: TypoProps) {
  return <Tag className={cls('text-title-2 font-bold', className)} {...props} />;
}

export function T3({ as: Tag = 'h3', className, ...props }: TypoProps) {
  return <Tag className={cls('text-title-3 font-bold', className)} {...props} />;
}

export function T4({ as: Tag = 'h4', className, ...props }: TypoProps) {
  return <Tag className={cls('text-title-4 font-bold', className)} {...props} />;
}

// Head (22 / 20 / 18 / 17px)
export function H1({ as: Tag = 'h5', className, ...props }: TypoProps) {
  return <Tag className={cls('text-head-1 font-semibold', className)} {...props} />;
}

export function H2({ as: Tag = 'h6', className, ...props }: TypoProps) {
  return <Tag className={cls('text-head-2 font-semibold', className)} {...props} />;
}

export function H3({ as: Tag = 'p', className, ...props }: TypoProps) {
  return <Tag className={cls('text-head-3 font-semibold', className)} {...props} />;
}

export function H4({ as: Tag = 'p', className, ...props }: TypoProps) {
  return <Tag className={cls('text-head-4 font-semibold', className)} {...props} />;
}

// Body (16 / 15px)
export function B1({ as: Tag = 'p', className, ...props }: TypoProps) {
  return <Tag className={cls('text-body-1', className)} {...props} />;
}

export function B2({ as: Tag = 'p', className, ...props }: TypoProps) {
  return <Tag className={cls('text-body-2', className)} {...props} />;
}

// Label (14 / 13px)
export function L1({ as: Tag = 'span', className, ...props }: TypoProps) {
  return <Tag className={cls('text-label-1 font-medium', className)} {...props} />;
}

export function L2({ as: Tag = 'span', className, ...props }: TypoProps) {
  return <Tag className={cls('text-label-2 font-medium', className)} {...props} />;
}

// Caption (12px)
export function Caption({ as: Tag = 'span', className, ...props }: TypoProps) {
  return <Tag className={cls('text-caption-1', className)} {...props} />;
}
