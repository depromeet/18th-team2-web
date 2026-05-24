import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { H2 } from '@/components/ui/Typography';

interface AutoEndedBottomSheetProps {
  onCreateParty: () => void;
  onHome: () => void;
  onClose: () => void;
}

export function AutoEndedBottomSheet({
  onCreateParty,
  onHome,
  onClose,
}: AutoEndedBottomSheetProps) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-50 w-full max-w-150 -translate-x-1/2 bg-black/70">
      <section className="absolute bottom-8 left-1/2 flex w-[calc(100%-24px)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex h-4 items-end justify-center">
          <span className="bg-grey-100 h-1 w-12 rounded-full" />
        </div>
        <header className="flex items-start justify-between px-5 pt-5 pb-2.5">
          <H2 className="text-black">
            파티가 자동 종료되었어요 🥲
            <br />
            새로운 파티를 만드시겠어요?
          </H2>
          <button
            type="button"
            aria-label="닫기"
            className="text-grey-400 flex size-5 shrink-0 items-center justify-center"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>
        <div className="flex flex-col gap-2 px-5 py-4">
          <Button type="button" onClick={onCreateParty}>
            새로 파티를 만들래요
          </Button>
          <Button type="button" variant="link-primary" className="mx-auto" onClick={onHome}>
            홈으로 가기
          </Button>
        </div>
      </section>
    </div>
  );
}
