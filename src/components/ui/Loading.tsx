import { B1 } from './Typography';

export function Loading() {
  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-2 bg-black/40">
      {/** TODO: 로딩 이미지 추가 */}
      <div className="h-38.75 w-38.75 bg-amber-200">이미지 자리</div>
      <B1 as="p" className="text-grey-30">
        로딩중이에요
      </B1>
    </div>
  );
}
