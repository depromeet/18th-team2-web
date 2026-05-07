import type { ReactNode } from 'react';

import { B1, H1 } from '@/components/ui/Typography';

interface RollingPaperFormHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function RollingPaperFormHeading({
  title,
  description,
  className,
}: RollingPaperFormHeadingProps) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <H1 as="h1" className="text-black">
        {title}
      </H1>
      {description && <B1 className="text-grey-400 font-medium">{description}</B1>}
    </div>
  );
}
