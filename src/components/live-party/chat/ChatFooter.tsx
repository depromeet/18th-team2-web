import { FirecrackerButton } from './FirecrackerButton';

export function ChatFooter() {
  return (
    <div className="flex items-center gap-3 p-4">
      <input
        placeholder="하고싶은 말을 남겨주세요!"
        className="h-11 w-full rounded-[200px] border border-white/60 bg-white/10 px-4 py-3 font-semibold text-white outline-none placeholder:font-normal placeholder:text-gray-300"
      />
      <FirecrackerButton />
    </div>
  );
}
