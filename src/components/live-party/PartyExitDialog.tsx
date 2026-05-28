import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface PartyExitDialogProps {
  isOpen: boolean;
  isHost: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PartyExitDialog({ isOpen, isHost, onCancel, onConfirm }: PartyExitDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      labelledById="party-dialog-title"
      title={
        isHost ? (
          <>아직 파티가 진행 중이에요</>
        ) : (
          <>
            아직 파티가 진행중이에요
            <br />
            파티에서 나가시겠어요?
          </>
        )
      }
      description={
        isHost ? (
          <>
            종료하면 실시간 파티방이 사라져요
            <br />
            정말 파티를 종료하시겠어요?
          </>
        ) : undefined
      }
      cancelAction={{
        label: isHost ? '파티 종료하기' : '파티 나가기',
        onClick: onConfirm,
        variant: 'white-red',
      }}
      confirmAction={{ label: '아니오', onClick: onCancel }}
      onClose={onCancel}
    />
  );
}
