import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ isOpen, onCancel, onConfirm }: LogoutConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      labelledById="logout-dialog-title"
      title="계정에서 로그아웃 할게요"
      description="확인 버튼을 누르면 홈으로 돌아가요"
      cancelAction={{ label: '취소', onClick: onCancel }}
      confirmAction={{ label: '확인', onClick: onConfirm }}
      onClose={onCancel}
    />
  );
}
