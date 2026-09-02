import iconChat from '@/assets/icons/icon-chat.svg';
import letterImage from '@/assets/images/live-party/letter.png';
import { Button } from '@/components/ui/Button';
import { Caption } from '@/components/ui/Typography';
import { formatDateParts, formatKoreanTime } from '@/utils/date';

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

interface InvitationCardProps {
  hostName: string;
  startsAt: Date;
  partyOption: 'REALTIME' | 'PAPER_ONLY';
  isHost: boolean;
  isWithin5Minutes: boolean;
  hasWrittenRollingPaper: boolean;
  onWriteRollingPaper: () => void;
  onViewRollingPaper: () => void;
}

function formatInvitationDate(date: Date) {
  const { year, month, day } = formatDateParts(date);
  return `${year} · ${month} · ${day}`;
}

function formatDday(date: Date) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diff = Math.ceil((targetStart - todayStart) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'D-Day';
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}

function InvitationDivider({ label }: { label: string }) {
  return (
    <div className="my-7 flex items-center justify-center gap-2 [@media_(max-height:740px)]:my-5">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="h-px min-w-0 flex-1 bg-blue-50" />
        <span className="h-1 w-1 shrink-0 rounded-full bg-blue-50" />
      </div>
      <span className="text-body-1 shrink-0 bg-gradient-to-b from-[#3444f3] to-[#5b8afc] bg-clip-text font-medium text-transparent opacity-60">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="h-1 w-1 shrink-0 rounded-full bg-blue-50" />
        <span className="h-px min-w-0 flex-1 bg-blue-50" />
      </div>
    </div>
  );
}

function InvitationCallout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'check';
  children: string;
}) {
  return (
    <div className="bg-blue-30 flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 py-2 text-blue-700">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[12px] leading-none font-bold text-white">
          {type === 'check' ? '✓' : 'i'}
        </span>
      </span>
      <span className="text-label-1 font-medium">{children}</span>
    </div>
  );
}

export function InvitationCard({
  startsAt,
  partyOption,
  isHost,
  isWithin5Minutes,
  hasWrittenRollingPaper,
  onWriteRollingPaper,
  onViewRollingPaper,
}: InvitationCardProps) {
  const isRollingPaper = partyOption === 'PAPER_ONLY';
  const showRollingPaperDisabledNotice = !isHost && !hasWrittenRollingPaper && isWithin5Minutes;

  return (
    <article
      className="flex w-full max-w-[343px] flex-col rounded-[12px] bg-white px-5 pt-5 pb-5 [@media_(max-height:740px)]:pt-4 [@media_(max-height:740px)]:pb-4"
      style={{ boxShadow: '0px 0px 4px rgba(88, 146, 255, 0.3)' }}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="text-caption-1 rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
          {formatDday(startsAt)}
        </span>

        <div className="text-center">
          <p className="text-head-3 text-grey-700 font-medium whitespace-nowrap">
            {formatInvitationDate(startsAt)}{' '}
            <span className="font-bold text-blue-500">
              {WEEKDAYS[startsAt.getDay()]} {formatKoreanTime(startsAt)}
            </span>
          </p>
          <p className="text-body-1 text-grey-500 mt-1 font-medium">
            {isRollingPaper ? '롤링페이퍼를 함께 남겨주세요' : '약 10분 정도 진행되는 파티에요'}
          </p>
        </div>

        {!isRollingPaper && !isWithin5Minutes && (
          <button
            type="button"
            className="text-body-2 inline-flex h-[46px] items-center justify-center gap-1 rounded-[12px] bg-[#FEE500] px-7 font-semibold text-black focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none [@media_(max-height:740px)]:h-10 [@media_(max-height:740px)]:px-5"
          >
            <img src={iconChat} alt="" className="h-5 w-5" />
            5분 전 카톡으로 알림받기
          </button>
        )}
      </div>

      <InvitationDivider label={isHost ? '롤링페이퍼' : '참여가 어려우신가요?'} />

      <div className="flex flex-col items-center">
        {isHost ? (
          <>
            <img
              src={letterImage}
              alt=""
              aria-hidden="true"
              className="h-[220px] w-full max-w-[240px] object-contain [@media_(max-height:740px)]:h-[160px]"
            />

            <div className="mt-5 text-center [@media_(max-height:740px)]:mt-3">
              <h2 className="text-head-2 text-grey-900 font-semibold whitespace-pre-line">
                초대장을 공유하고{'\n'}롤링페이퍼를 받아보세요!
              </h2>
              <p className="text-body-1 text-grey-500 mt-4 font-medium [@media_(max-height:740px)]:mt-3">
                롤링페이퍼는 파티가 끝난 후 볼 수 있어요
              </p>
            </div>
          </>
        ) : (
          <>
            <img
              src={letterImage}
              alt=""
              aria-hidden="true"
              className="h-[220px] w-full max-w-[240px] object-contain [@media_(max-height:740px)]:h-[160px]"
            />

            <div className="mt-5 text-center [@media_(max-height:740px)]:mt-3">
              <h2 className="text-head-2 text-grey-900 font-semibold">생일 축하 한마디 남기기</h2>
              <p className="text-body-1 text-grey-500 mt-4 font-medium whitespace-pre-line [@media_(max-height:740px)]:mt-3">
                롤링페이퍼를 미리 작성해두면{'\n'}파티 종료 후 생일 주인공에게 전달돼요 💌
              </p>
            </div>

            {showRollingPaperDisabledNotice ? (
              <div className="mt-5 flex w-full flex-col gap-3 [@media_(max-height:740px)]:mt-4">
                <InvitationCallout>파티가 끝나고 다시 작성할 수 있어요</InvitationCallout>
                <Button variant="secondary" size="full" disabled>
                  롤링페이퍼 남기기
                </Button>
              </div>
            ) : hasWrittenRollingPaper ? (
              <div className="mt-5 flex w-full flex-col gap-3 [@media_(max-height:740px)]:mt-4">
                <InvitationCallout type="check">롤링페이퍼를 이미 작성했어요</InvitationCallout>
                <Button variant="white-blue" size="full" onClick={onViewRollingPaper}>
                  롤링페이퍼 확인하기
                </Button>
              </div>
            ) : (
              <>
                <Caption className="mt-5 font-semibold text-blue-500 [@media_(max-height:740px)]:mt-4">
                  작성한 롤링페이퍼는 주인공만 볼 수 있어요
                </Caption>

                <Button
                  className="mt-4"
                  variant="primary"
                  size="full"
                  onClick={onWriteRollingPaper}
                >
                  롤링페이퍼 남기기
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </article>
  );
}
