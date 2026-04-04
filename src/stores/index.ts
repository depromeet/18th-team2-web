// Zustand 스토어는 도메인별 파일로 분리합니다.
// 예시: src/stores/useAuthStore.ts
//
// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
//
// interface AuthState {
//   isAuthenticated: boolean;
//   user: null | { id: string; name: string };
//   login: (user: { id: string; name: string }) => void;
//   logout: () => void;
// }
//
// export const useAuthStore = create<AuthState>()(
//   devtools(
//     (set) => ({
//       isAuthenticated: false,
//       user: null,
//       login: (user) => set({ isAuthenticated: true, user }),
//       logout: () => set({ isAuthenticated: false, user: null }),
//     }),
//     { name: 'AuthStore' },
//   ),
// );

export {};
