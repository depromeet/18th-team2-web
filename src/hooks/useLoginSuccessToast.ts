import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { ToastState } from '@/components/ui/Toast';

export function useLoginSuccessToast() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const state = location.state as { loginSuccess?: boolean } | null;
    if (!state?.loginSuccess) return;

    setToast({ id: Date.now(), type: 'success', message: '로그인에 성공했어요' });

    // 새로고침·뒤로가기 시 토스트가 다시 뜨지 않도록 플래그 제거
    const { loginSuccess: _loginSuccess, ...restState } = state;
    navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      { replace: true, state: Object.keys(restState).length > 0 ? restState : null },
    );
  }, [location, navigate]);

  return { toast, closeToast };
}
