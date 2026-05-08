import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface PartyDeleteDialogProps {
  isOpen: boolean;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PartyDeleteDialog({
  isOpen,
  isPending = false,
  onCancel,
  onConfirm,
}: PartyDeleteDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      labelledById="party-delete-dialog-title"
      title="파티를 삭제할까요?"
      description={
        <>
          *삭제하면 참가자들이 남긴 롤링페이퍼도
          <br />
          함께 사라져요.
        </>
      }
      descriptionTone="danger"
      cancelAction={{ label: '취소', onClick: onCancel }}
      confirmAction={{
        label: isPending ? '삭제 중' : '삭제하기',
        onClick: isPending ? () => undefined : onConfirm,
        variant: 'danger',
      }}
      onClose={onCancel}
    />
  );
}
