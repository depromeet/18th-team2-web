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
      title={<>아직 파티가 진행 중이에요</>}
      description={
        <>
          종료하면 실시간 파티방이 사라져요
          <br />
          정말 파티를 종료하시겠어요?
        </>
      }
      cancelAction={{ label: '파티 종료하기', onClick: onConfirm, variant: 'white-red' }}
      confirmAction={{ label: '아니오', onClick: onCancel }}
      onClose={onCancel}
    />
  );
}
