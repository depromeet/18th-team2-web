import archiveEmpty from '@/assets/images/home/archive-empty.svg';
import { B2 } from '@/components/ui/Typography';

export function ArchiveEmptyView() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <img src={archiveEmpty} alt="" aria-hidden draggable={false} />
      <B2 className="text-grey-300 text-center font-medium">
        아직 기록이 없어요
        <br />
        파티나 롤링페이퍼를 만들어보세요!
      </B2>
    </div>
  );
}
