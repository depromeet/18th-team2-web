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
      title="파티를 정말 삭제하시겠어요?"
      description={
        <>
          * 파티를 삭제하면 친구들이
          <br />
          초대장을 확인할 수 없고 복구도 불가능해요
        </>
      }
      descriptionTone="danger"
      cancelAction={{ label: '취소', onClick: onCancel }}
      confirmAction={{
        label: isPending ? '삭제 중' : '파티 삭제하기',
        onClick: isPending ? () => undefined : onConfirm,
        variant: 'primary',
      }}
      onClose={onCancel}
    />
  );
}
