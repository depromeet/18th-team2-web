import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarColorIcon from '@/assets/images/icons/calendar-color.svg?react';
import CalendarMonoIcon from '@/assets/images/icons/calendar-mono.svg?react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1 } from '@/components/ui/Typography';
import { DatePickerPopover } from '@/components/party-create/DatePickerPopover';
import { EditableNamePill } from '@/components/party-create/EditableNamePill';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { InvitationCard } from '@/components/party-create/InvitationCard';
import { StackedInvitationBackdrop } from '@/components/party-create/StackedInvitationBackdrop';
import { ROLLING_PAPER_DURATION_DAYS } from '@/constants/partyCreate';
import { ROUTES } from '@/constants/routes';
import { useAnchoredOverlay } from '@/hooks/useAnchoredOverlay';
import { useCreateHostName } from '@/hooks/useCreateHostName';
import { useMe } from '@/services/auth';
import { useActivateInviteLink, useCreatePaperOnlyParty } from '@/services/party-create';
import {
  addDays,
  formatDotDate,
  formatIsoDate,
  formatKoreanDate,
  formatKoreanShortDate,
  getTodayMidnight,
} from '@/utils/date';

export default function RollingPaperCreateSetupPage() {
  const navigate = useNavigate();
  const { data: meData } = useMe();

  const { defaultHostName, hostName, setHostName } = useCreateHostName(meData?.data?.name);
  const today = getTodayMidnight();
  const isReady = Boolean(hostName);
  const [createError, setCreateError] = useState<string | null>(null);
  const { mutate: createPaperOnlyParty, isPending: isCreatingParty } = useCreatePaperOnlyParty();
  const { mutate: activateInviteLink, isPending: isActivatingInviteLink } = useActivateInviteLink();
  const isPending = isCreatingParty || isActivatingInviteLink;

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { anchorRef: datePillRef, position: datePickerPosition } =
    useAnchoredOverlay<HTMLSpanElement>(isDatePickerOpen);

  const endDate = addDays(selectedDate, ROLLING_PAPER_DURATION_DAYS);
  const footerDate = `${formatDotDate(selectedDate)}  ~  ${formatDotDate(endDate)}`;

  const handleClosePicker = () => {
    setIsDatePickerOpen(false);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const handleCreateRollingPaper = () => {
    if (!hostName) return;

    setCreateError(null);
    createPaperOnlyParty(
      {
        celebrantNickname: hostName,
        startedDate: formatIsoDate(selectedDate),
      },
      {
        onSuccess: (createRes) => {
          const partyId = createRes.data?.partyId;
          if (partyId == null) {
            setCreateError('롤링페이퍼 생성 응답을 확인할 수 없어요.');
            return;
          }

          activateInviteLink(partyId, {
            onSuccess: (inviteRes) => {
              const inviteToken = inviteRes.data?.token;
              if (!inviteToken) {
                setCreateError('초대장 링크 응답을 확인할 수 없어요.');
                return;
              }

              navigate(ROUTES.createRollingPaperComplete, {
                state: {
                  hostName,
                  startDate: selectedDate.toISOString(),
                  endDate: endDate.toISOString(),
                  partyId,
                  inviteToken,
                },
              });
            },
            onError: () => setCreateError('초대장 링크를 생성하지 못했어요.'),
          });
        },
        onError: () => setCreateError('롤링페이퍼를 생성하지 못했어요.'),
      },
    );
  };

  return (
    <div className="bg-gradient-bg relative flex min-h-screen flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-[38vh] bg-gradient-to-b from-[#EEF5FF]/0 via-[#EEF5FF] to-[#F5F9FF]"
      />
      <div className="relative z-10">
        <PageHeader />
      </div>

      {createError && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-3 text-sm text-white">
          {createError}
        </div>
      )}

      <H1 className="relative z-10 mt-2 px-5 tracking-[-0.0002em]">
        일주일 동안 롤링페이퍼를 받아요
      </H1>

      <div className="relative mt-[clamp(44px,7vh,72px)] [@media_(min-height:900px)]:mt-[120px]">
        {isDatePickerOpen && (
          <button
            type="button"
            aria-label="선택창 닫기"
            className="fixed inset-0 z-40 cursor-default"
            onClick={handleClosePicker}
          />
        )}
        <div className="relative z-10 flex justify-center">
          <InvitationCard title="롤링페이퍼 초대장" footerDate={footerDate}>
            <div className="text-head-1 text-grey-600 relative flex flex-col gap-3 font-normal tracking-[-0.0002em]">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <EditableNamePill
                  value={hostName}
                  fallbackValue={defaultHostName}
                  onChange={setHostName}
                />
                <span>의</span>
              </div>
              <span>롤링페이퍼를</span>
              <div className="relative flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <span ref={datePillRef} className="inline-flex">
                  <HighlightPill
                    variant={isDatePickerOpen ? 'active' : 'filled'}
                    icon={
                      isDatePickerOpen ? (
                        <CalendarColorIcon
                          className="h-[26px] w-[26px] shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <CalendarMonoIcon
                          className="h-[26px] w-[26px] shrink-0"
                          aria-hidden="true"
                        />
                      )
                    }
                    onClick={() => setIsDatePickerOpen((open) => !open)}
                  >
                    {formatKoreanDate(selectedDate)}
                  </HighlightPill>
                </span>
                <span>부터</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <strong className="font-semibold text-blue-500">
                  {formatKoreanShortDate(endDate)}
                </strong>
                <span>까지 받아요</span>
              </div>
            </div>
          </InvitationCard>
        </div>
        <StackedInvitationBackdrop />
      </div>

      {isDatePickerOpen && datePickerPosition && (
        <DatePickerPopover
          selectedDate={selectedDate}
          minDate={today}
          position={datePickerPosition}
          onSelectDate={handleSelectDate}
        />
      )}

      <div className="relative z-30 mt-auto px-5 pb-6">
        <Button
          variant="primary"
          size="full"
          disabled={!isReady || isPending}
          onClick={handleCreateRollingPaper}
        >
          롤링페이퍼 생성하기
        </Button>
      </div>
    </div>
  );
}
