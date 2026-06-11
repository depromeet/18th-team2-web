import { B1 } from './Typography';

interface LoadingProps {
  variant?: 'overlay' | 'white';
}

export function Loading({ variant = 'overlay' }: LoadingProps) {
  if (variant === 'white') {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center gap-2 bg-white">
        {/** TODO: 로딩 이미지 추가 */}
        <div className="h-38.75 w-38.75 bg-amber-200">이미지 자리</div>
        <B1 as="p" className="text-grey-400">
          로딩중이에요
        </B1>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-2 bg-black/50">
      {/** TODO: 로딩 이미지 추가 */}
      <div className="h-38.75 w-38.75 bg-amber-200">이미지 자리</div>
      <B1 as="p" className="text-grey-30">
        로딩중이에요
      </B1>
    </div>
  );
}
