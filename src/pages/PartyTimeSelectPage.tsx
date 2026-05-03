import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import Picker from 'react-mobile-picker';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H1 } from '@/components/ui/Typography';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { InvitationCard } from '@/components/party-create/InvitationCard';
import { StackedInvitationBackdrop } from '@/components/party-create/StackedInvitationBackdrop';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  formatDisplayTime,
  formatDotDate,
  formatKoreanDate,
  getTodayMidnight,
} from '@/utils/date';

const NAME_MAX_LENGTH = 10;
const PARTY_DURATION_MINUTES = 10;

// TODO: 온보딩/유저 API 연결되면 제거
const DUMMY_NAME = '김이라';

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
  const user = useAuthStore((s) => s.user);

  const userName = (user?.name ?? DUMMY_NAME).slice(0, NAME_MAX_LENGTH);
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
  const isReady = Boolean(userName && selectedTime);

  const isDatePickerOpen = pickerMode === 'date';
  const isTimePickerOpen = pickerMode === 'time';

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
    // TODO: 파티 생성 API 호출
    navigate(ROUTES.createPartyCharacter, {
      state: {
        hostName: userName,
        partyDate: selectedDate.toISOString(),
        partyTime: selectedTime,
      },
    });
  };

  return (
    <MobileLayout>
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
              className="fixed inset-0 z-20 cursor-default"
              onClick={handleClosePicker}
            />
          )}
          <div className="relative z-10 flex justify-center">
            <InvitationCard title="파티 초대장" footerDate={formatDotDate(selectedDate)}>
              <div className="relative flex flex-col gap-3 text-head-1 font-normal text-grey-600 tracking-[-0.0002em]">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  <HighlightPill>{userName || '이름'}</HighlightPill>
                  <span>를 위해</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  <HighlightPill
                    variant={isDatePickerOpen ? 'active' : 'filled'}
                    onClick={handleOpenDatePicker}
                  >
                    {formatKoreanDate(selectedDate)}
                  </HighlightPill>
                  <span>에</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  <HighlightPill
                    variant={
                      isTimePickerOpen ? 'active' : selectedTime ? 'filled' : 'outlined'
                    }
                    onClick={handleOpenTimePicker}
                  >
                    {isTimePickerOpen ? pendingTime : selectedTime ?? '시간선택'}
                  </HighlightPill>
                  <span>부터 {PARTY_DURATION_MINUTES}분 동안</span>
                </div>
                <span>온라인 생일 파티가 열려요</span>
              </div>
            </InvitationCard>
          </div>
          <StackedInvitationBackdrop />
          {isDatePickerOpen && (
            <div
              className="absolute top-[212px] z-30 w-[282px] rounded-[8px] bg-grey-600/70 px-4 py-3 text-white shadow-lg backdrop-blur-sm"
              style={{ left: 'calc(50% - 141.5px)' }}
              onClick={(event) => event.stopPropagation()}
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                defaultMonth={selectedDate}
                disabled={{ before: today }}
                onSelect={handleSelectDate}
                weekStartsOn={0}
                formatters={{
                  formatCaption: (month) => `${month.getFullYear()} ${month.getMonth() + 1}월`,
                  formatWeekdayName: (weekday) =>
                    ['일', '월', '화', '수', '목', '금', '토'][weekday.getDay()],
                }}
                classNames={{
                  month_caption: 'mb-3 flex items-center justify-between',
                  caption_label: 'text-body-1 font-semibold text-white',
                  nav: 'absolute top-3 right-4 flex gap-4',
                  button_previous: 'text-grey-200',
                  button_next: 'text-grey-200',
                  month_grid: 'w-full border-collapse',
                  weekdays: 'text-label-2 text-grey-300',
                  weekday: 'h-7 font-normal',
                  week: 'h-7',
                  day: 'h-7 w-9 text-center align-middle',
                  day_button:
                    'h-7 w-7 rounded-full text-body-1 text-white disabled:text-grey-300',
                  selected: '[&>button]:bg-white [&>button]:font-semibold [&>button]:text-blue-500',
                  disabled: '[&>button]:text-grey-300',
                  outside: '[&>button]:text-grey-300',
                }}
              />
            </div>
          )}
          {isTimePickerOpen && (
            <div
              className="absolute top-[260px] z-30 w-[282px] rounded-[8px] bg-grey-600/70 px-5 py-3 text-white shadow-lg backdrop-blur-sm"
              style={{ left: 'calc(50% - 141.5px)' }}
              onClick={(event) => event.stopPropagation()}
            >
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
              <span className="pointer-events-none absolute top-[87px] left-[157px] text-head-1 text-white">
                :
              </span>
            </div>
          )}
        </div>

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
    </MobileLayout>
  );
}
