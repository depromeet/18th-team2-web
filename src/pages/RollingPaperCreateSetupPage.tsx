import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H1 } from '@/components/ui/Typography';
import { DatePickerPopover } from '@/components/party-create/DatePickerPopover';
import { EditableNamePill } from '@/components/party-create/EditableNamePill';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { InvitationCard } from '@/components/party-create/InvitationCard';
import { StackedInvitationBackdrop } from '@/components/party-create/StackedInvitationBackdrop';
import { ROUTES } from '@/constants/routes';
import { useAnchoredOverlay } from '@/hooks/useAnchoredOverlay';
import { useCreateHostName } from '@/hooks/useCreateHostName';
import { useMe } from '@/services/auth';
import {
  addDays,
  formatDotDate,
  formatKoreanDate,
  formatKoreanShortDate,
  getTodayMidnight,
} from '@/utils/date';

const ROLLING_PAPER_DURATION_DAYS = 7;

export default function RollingPaperCreateSetupPage() {
  const navigate = useNavigate();
  const { data: meData } = useMe();

  const { defaultHostName, hostName, setHostName } = useCreateHostName(meData?.data?.name);
  const today = getTodayMidnight();

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
    // TODO: 생성 API 확정 시 useCreateParty(PAPER_ONLY) mutation으로 교체하고 hostName/selectedDate를 payload에 포함
    navigate(ROUTES.createRollingPaperComplete, {
      state: {
        hostName,
        startDate: selectedDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  };

  return (
    <div className="bg-gradient-bg relative flex min-h-screen flex-col">
      <header className="px-5 pt-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.createParty)}
          aria-label="뒤로가기"
          className="text-grey-800 -ml-2 flex h-10 w-10 items-center justify-center"
        >
          <ChevronLeftIcon />
        </button>
      </header>

      <H1 className="mt-2 px-5 tracking-[-0.0002em]">일주일 동안 롤링페이퍼를 받아요</H1>

      <div className="relative mt-8">
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
        <Button variant="primary" size="full" onClick={handleCreateRollingPaper}>
          롤링페이퍼 생성하기
        </Button>
      </div>
    </div>
  );
}
