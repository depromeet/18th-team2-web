import DownloadIcon from '@/assets/images/icons/download.svg?react';

export function ImageDownloadButton() {
  return (
    <button
      type="button"
      aria-label="이미지 다운로드 기능 준비 중"
      title="이미지 다운로드 기능 준비 중"
      disabled
      className="border-grey-200 text-grey-900 flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border bg-white"
    >
      <DownloadIcon className="h-6 w-6" />
    </button>
  );
}
