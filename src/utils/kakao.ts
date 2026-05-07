import kakaoShareImage from '@/assets/images/hapalin-party-card.png';
import { config } from '@/config/env';

const KAKAO_SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js';
const KAKAO_SDK_SCRIPT_ID = 'kakao-javascript-sdk';

let sdkLoadPromise: Promise<boolean> | null = null;

function loadKakaoSdk(): Promise<boolean> {
  if (window.Kakao) {
    return Promise.resolve(true);
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise((resolve) => {
    const existingScript = document.getElementById(KAKAO_SDK_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(Boolean(window.Kakao)), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(Boolean(window.Kakao));
    script.onerror = () => {
      sdkLoadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

async function initKakao(): Promise<boolean> {
  if (!config.kakaoJavascriptKey) {
    return false;
  }

  const isSdkLoaded = await loadKakaoSdk();
  if (!isSdkLoaded || !window.Kakao) {
    return false;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(config.kakaoJavascriptKey);
  }

  return true;
}

export async function shareToKakao(
  link: string,
  title: string,
  description = '링크를 확인해보세요',
): Promise<boolean> {
  const isReady = await initKakao();
  if (!isReady || !window.Kakao) {
    return false;
  }

  const shareImageUrl = new URL(kakaoShareImage, window.location.origin).href;

  await window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl: shareImageUrl,
      link: {
        mobileWebUrl: link,
        webUrl: link,
      },
    },
    buttons: [
      {
        title: '확인하기',
        link: {
          mobileWebUrl: link,
          webUrl: link,
        },
      },
    ],
  });

  return true;
}
