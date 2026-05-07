const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `힌트: .env.example을 복사하여 .env 파일을 생성하세요 → cp .env.example .env`,
    );
  }
  return value ?? '';
};

export const config = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL'),
  appEnv: getEnvVar('VITE_APP_ENV', false) || 'development',
  kakaoJavascriptKey: getEnvVar('VITE_KAKAO_JAVASCRIPT_KEY', false),
} as const;
