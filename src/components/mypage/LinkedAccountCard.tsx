import kakaoIcon from '@/assets/icons/icon-kakao.svg';
import { H3, L1 } from '@/components/ui/Typography';

interface LinkedAccountCardProps {
  provider: 'KAKAO';
  connectedAt: string;
}

const providerLabel = {
  KAKAO: 'Kakao',
} as const;

export function LinkedAccountCard({ provider, connectedAt }: LinkedAccountCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
      <div className="flex items-center gap-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500">
          <img src={kakaoIcon} alt="" className="h-2.5 w-2.5" />
        </span>
        <H3 as="span" className="text-grey-700 font-medium">
          {providerLabel[provider]}
        </H3>
      </div>
      <L1 className="text-grey-300">{connectedAt} 연결됨</L1>
    </div>
  );
}
