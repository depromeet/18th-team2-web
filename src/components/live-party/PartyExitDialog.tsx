import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface PartyExitDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PartyExitDialog({ isOpen, onCancel, onConfirm }: PartyExitDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      labelledById="party-dialog-title"
      title={
        <>
          아직 파티가 진행 중이에요!
          <br />
          파티를 나가시겠어요?
        </>
      }
      cancelAction={{ label: '파티 나가기', onClick: onConfirm }}
      confirmAction={{ label: '아니오', onClick: onCancel }}
      onClose={onCancel}
    />
  );
}
