import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface LaterWriteRollingPaperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LaterWriteRollingPaperDialog({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}: LaterWriteRollingPaperDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      labelledById="party-dialog-title"
      title={
        <>
          롤링페이퍼는 파티가 끝난 뒤
          <br />
          7일 동안 작성할 수 있어요.
        </>
      }
      description={
        <>
          작성 가능한 기간 안에는 <br />
          언제든 다시 돌아올 수 있어요.
        </>
      }
      cancelAction={{ label: '나중에 하기', onClick: onConfirm }}
      confirmAction={{ label: '지금 작성하기', onClick: onCancel }}
      onClose={onClose}
    />
  );
}
