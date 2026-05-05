import { useState } from 'react';
import Picker from 'react-mobile-picker';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H1 } from '@/components/ui/Typography';
import { AnchoredPopover } from '@/components/party-create/AnchoredPopover';
import { DatePickerPopover } from '@/components/party-create/DatePickerPopover';
import { EditableNamePill } from '@/components/party-create/EditableNamePill';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { InvitationCard } from '@/components/party-create/InvitationCard';
import { StackedInvitationBackdrop } from '@/components/party-create/StackedInvitationBackdrop';
import { ROUTES } from '@/constants/routes';
import { useAnchoredOverlay } from '@/hooks/useAnchoredOverlay';
import { useCreateHostName } from '@/hooks/useCreateHostName';
import { useMe } from '@/services/auth';
import { formatDisplayTime, formatDotDate, formatKoreanDate, getTodayMidnight } from '@/utils/date';

const PARTY_DURATION_MINUTES = 10;

type PickerMode = 'date' | 'time' | null;

interface TimePickerValue {
  [key: string]: string | number;
  period: string;
  hour: string;
  minute: string;
}

const TIME_PICKER_OPTIONS = {
  period: ['오전', '오후'],
  hour: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  minute: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
} as const;

export default function PartyTimeSelectPage() {
  const navigate = useNavigate();
  const { data: meData } = useMe();

  const { defaultHostName, hostName, setHostName } = useCreateHostName(meData?.data?.name);
  const today = getTodayMidnight();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [pendingTime, setPendingTime] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [timePickerValue, setTimePickerValue] = useState<TimePickerValue>({
    period: '오후',
    hour: '4',
    minute: '00',
  });
  const isReady = Boolean(hostName && selectedTime);

  const isDatePickerOpen = pickerMode === 'date';
  const isTimePickerOpen = pickerMode === 'time';
  const { anchorRef: datePillRef, position: datePickerPosition } =
    useAnchoredOverlay<HTMLSpanElement>(isDatePickerOpen);
  const { anchorRef: timePillRef, position: timePickerPosition } =
    useAnchoredOverlay<HTMLSpanElement>(isTimePickerOpen);

  const handleOpenDatePicker = () => {
    setPickerMode((current) => (current === 'date' ? null : 'date'));
  };

  const handleOpenTimePicker = () => {
    setPendingTime(selectedTime ?? formatDisplayTime(timePickerValue));
    setPickerMode((current) => (current === 'time' ? null : 'time'));
  };

  const handleClosePicker = () => {
    if (pickerMode === 'time') {
      setSelectedTime(pendingTime ?? formatDisplayTime(timePickerValue));
    }
    setPickerMode(null);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setPickerMode(null);
  };

  const handleChangeTime = (value: TimePickerValue) => {
    setTimePickerValue(value);
    setPendingTime(formatDisplayTime(value));
  };

  const handleCreateParty = () => {
    // TODO: 생성 API 확정 시 useCreateParty mutation으로 교체하고 hostName/selectedDate/selectedTime을 payload에 포함
    navigate(ROUTES.createPartyCharacter, {
      state: {
        hostName,
        partyDate: selectedDate.toISOString(),
        partyTime: selectedTime,
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

      <H1 className="mt-2 px-5 tracking-[-0.0002em]">파티 시간을 선택해 주세요</H1>

      <div className="relative mt-6">
        {pickerMode && (
          <button
            type="button"
            aria-label="선택창 닫기"
            className="fixed inset-0 z-40 cursor-default"
            onClick={handleClosePicker}
          />
        )}
        <div className="relative z-10 flex justify-center">
          <InvitationCard title="파티 초대장" footerDate={formatDotDate(selectedDate)}>
            <div className="text-head-1 text-grey-600 relative flex flex-col gap-3 font-normal tracking-[-0.0002em]">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <EditableNamePill
                  value={hostName}
                  fallbackValue={defaultHostName}
                  onChange={setHostName}
                />
                <span>를 위해</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <span ref={datePillRef} className="inline-flex">
                  <HighlightPill
                    variant={isDatePickerOpen ? 'active' : 'filled'}
                    onClick={handleOpenDatePicker}
                  >
                    {formatKoreanDate(selectedDate)}
                  </HighlightPill>
                </span>
                <span>에</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <span ref={timePillRef} className="inline-flex">
                  <HighlightPill
                    variant={isTimePickerOpen ? 'active' : selectedTime ? 'filled' : 'outlined'}
                    onClick={handleOpenTimePicker}
                  >
                    {isTimePickerOpen ? pendingTime : (selectedTime ?? '시간선택')}
                  </HighlightPill>
                </span>
                <span>부터 {PARTY_DURATION_MINUTES}분 동안</span>
              </div>
              <span>온라인 생일 파티가 열려요</span>
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

      {isTimePickerOpen && timePickerPosition && (
        <AnchoredPopover position={timePickerPosition} className="px-5 py-3">
          <Picker
            value={timePickerValue}
            onChange={handleChangeTime}
            height={180}
            itemHeight={36}
            wheelMode="natural"
          >
            <Picker.Column name="period">
              {TIME_PICKER_OPTIONS.period.map((option) => (
                <Picker.Item key={option} value={option}>
                  {({ selected }) => (
                    <span className={`text-head-2 ${selected ? 'text-white' : 'text-grey-300'}`}>
                      {option}
                    </span>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name="hour">
              {TIME_PICKER_OPTIONS.hour.map((option) => (
                <Picker.Item key={option} value={option}>
                  {({ selected }) => (
                    <span className={`text-head-1 ${selected ? 'text-white' : 'text-grey-300'}`}>
                      {option}
                    </span>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name="minute">
              {TIME_PICKER_OPTIONS.minute.map((option) => (
                <Picker.Item key={option} value={option}>
                  {({ selected }) => (
                    <span className={`text-head-1 ${selected ? 'text-white' : 'text-grey-300'}`}>
                      {option}
                    </span>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
          <div className="pointer-events-none absolute top-[84px] right-5 left-5 border-y border-white/60">
            <div className="h-9" />
          </div>
          <span className="text-head-1 pointer-events-none absolute top-[87px] left-[157px] text-white">
            :
          </span>
        </AnchoredPopover>
      )}

      <div className="relative z-30 mt-auto px-5 pb-6">
        <Button
          variant={isReady ? 'primary' : 'secondary'}
          size="full"
          disabled={!isReady}
          onClick={handleCreateParty}
        >
          파티 생성하기
        </Button>
      </div>
    </div>
  );
}
