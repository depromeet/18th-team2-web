import { useEffect, useMemo, useState } from 'react';
import Picker from 'react-mobile-picker';
import { useNavigate } from 'react-router-dom';
import CalendarColorIcon from '@/assets/images/icons/calendar-color.svg?react';
import CalendarMonoIcon from '@/assets/images/icons/calendar-mono.svg?react';
import ClockColorIcon from '@/assets/images/icons/clock-color.svg?react';
import ClockMonoIcon from '@/assets/images/icons/clock-mono.svg?react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1 } from '@/components/ui/Typography';
import { AnchoredPopover } from '@/components/party-create/AnchoredPopover';
import { DatePickerPopover } from '@/components/party-create/DatePickerPopover';
import { EditableNamePill } from '@/components/party-create/EditableNamePill';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { InvitationCard } from '@/components/party-create/InvitationCard';
import { StackedInvitationBackdrop } from '@/components/party-create/StackedInvitationBackdrop';
import { PARTY_DURATION_MINUTES } from '@/constants/partyCreate';
import { ROUTES } from '@/constants/routes';
import { useAnchoredOverlay } from '@/hooks/useAnchoredOverlay';
import { useCreateHostName } from '@/hooks/useCreateHostName';
import { useMe } from '@/services/auth';
import {
  formatDisplayTime,
  formatDotDate,
  formatIsoDate,
  formatKoreanDate,
  getTodayMidnight,
} from '@/utils/date';
import { getObjectParticle } from '@/utils/koreanPostposition';

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
  minute: Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0')),
} as const;

function formatStartTime(value: TimePickerValue): string {
  const hour = Number(value.hour);
  const isPm = value.period.includes('후');
  const hour24 = isPm ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;
  return `${String(hour24).padStart(2, '0')}:${value.minute}`;
}

function getHour24(period: string, hour: string): number {
  const hourNumber = Number(hour);
  const isPm = period.includes('후');
  return isPm ? (hourNumber === 12 ? 12 : hourNumber + 12) : hourNumber === 12 ? 0 : hourNumber;
}

function getNearestTimePickerValue(): TimePickerValue {
  const now = new Date();
  const nextMinute = new Date(now);

  nextMinute.setSeconds(0, 0);
  if (nextMinute.getTime() < now.getTime()) {
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
  }

  const hour24 = nextMinute.getHours();

  return {
    period: hour24 < 12 ? '오전' : '오후',
    hour: String(hour24 % 12 === 0 ? 12 : hour24 % 12),
    minute: String(nextMinute.getMinutes()).padStart(2, '0'),
  };
}

function isSameCalendarDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getTimePickerDate(date: Date, value: TimePickerValue): Date {
  const nextDate = new Date(date);
  nextDate.setHours(getHour24(value.period, value.hour), Number(value.minute), 0, 0);
  return nextDate;
}

function isSelectableTime(date: Date, value: TimePickerValue): boolean {
  if (!isSameCalendarDate(date, new Date())) return true;
  return getTimePickerDate(date, value).getTime() >= Date.now();
}

function getFirstSelectableTimePickerValue(date: Date): TimePickerValue | null {
  const nearestTime = getNearestTimePickerValue();
  if (isSelectableTime(date, nearestTime)) return nearestTime;

  for (const period of TIME_PICKER_OPTIONS.period) {
    for (const hour of TIME_PICKER_OPTIONS.hour) {
      for (const minute of TIME_PICKER_OPTIONS.minute) {
        const value = { period, hour, minute };
        if (isSelectableTime(date, value)) return value;
      }
    }
  }

  return null;
}

function getAvailableTimePickerOptions(date: Date, value: TimePickerValue) {
  const isSelectable = (nextValue: TimePickerValue) => isSelectableTime(date, nextValue);

  return {
    period: TIME_PICKER_OPTIONS.period.filter((period) =>
      TIME_PICKER_OPTIONS.hour.some((hour) =>
        TIME_PICKER_OPTIONS.minute.some((minute) => isSelectable({ period, hour, minute })),
      ),
    ),
    hour: TIME_PICKER_OPTIONS.hour.filter((hour) =>
      TIME_PICKER_OPTIONS.minute.some((minute) =>
        isSelectable({ period: value.period, hour, minute }),
      ),
    ),
    minute: TIME_PICKER_OPTIONS.minute.filter((minute) => isSelectable({ ...value, minute })),
  };
}

export default function PartyTimeSelectPage() {
  const navigate = useNavigate();
  const { data: meData } = useMe();

  const { defaultHostName, hostName, setHostName } = useCreateHostName(meData?.data?.name);
  const today = getTodayMidnight();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [pendingTime, setPendingTime] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const [hasOpenedTimePicker, setHasOpenedTimePicker] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState<TimePickerValue>(() =>
    getNearestTimePickerValue(),
  );
  const isReady = Boolean(hostName && selectedTime);
  const hostNameParticle = getObjectParticle(hostName || defaultHostName);
  const timePickerOptions = useMemo(
    () => getAvailableTimePickerOptions(selectedDate, timePickerValue),
    [selectedDate, timePickerValue],
  );

  const isDatePickerOpen = pickerMode === 'date';
  const isTimePickerOpen = pickerMode === 'time';
  const { anchorRef: datePillRef, position: datePickerPosition } =
    useAnchoredOverlay<HTMLSpanElement>(isDatePickerOpen);
  const { anchorRef: timePillRef, position: timePickerPosition } =
    useAnchoredOverlay<HTMLSpanElement>(isTimePickerOpen);

  useEffect(() => {
    if (hasOpenedTimePicker) return;

    const timeoutId = window.setTimeout(() => {
      setShowTimeTooltip(true);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [hasOpenedTimePicker]);

  useEffect(() => {
    if (isSelectableTime(selectedDate, timePickerValue)) return;

    const nextTime = getFirstSelectableTimePickerValue(selectedDate);
    if (!nextTime) return;

    setTimePickerValue(nextTime);
    setPendingTime((current) => (current ? formatDisplayTime(nextTime) : current));
    setSelectedTime((current) => (current ? null : current));
  }, [selectedDate, timePickerValue]);

  const handleOpenDatePicker = () => {
    setPickerMode((current) => (current === 'date' ? null : 'date'));
  };

  const handleOpenTimePicker = () => {
    setHasOpenedTimePicker(true);
    setShowTimeTooltip(false);

    const nextTime =
      selectedTime && isSelectableTime(selectedDate, timePickerValue)
        ? timePickerValue
        : getFirstSelectableTimePickerValue(selectedDate);

    if (nextTime) {
      setTimePickerValue(nextTime);
      setPendingTime(formatDisplayTime(nextTime));
    } else {
      setPendingTime(null);
    }
    setPickerMode((current) => (current === 'time' ? null : 'time'));
  };

  const handleClosePicker = () => {
    if (pickerMode === 'time') {
      setSelectedTime(
        isSelectableTime(selectedDate, timePickerValue) ? formatDisplayTime(timePickerValue) : null,
      );
    }
    setPickerMode(null);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    if (!isSelectableTime(date, timePickerValue)) {
      const nextTime = getFirstSelectableTimePickerValue(date);
      setTimePickerValue(nextTime ?? getNearestTimePickerValue());
      setSelectedTime(null);
      setPendingTime(nextTime ? formatDisplayTime(nextTime) : null);
    }
    setPickerMode(null);
  };

  const handleChangeTime = (value: TimePickerValue) => {
    setTimePickerValue(value);
    setPendingTime(formatDisplayTime(value));
  };

  const handleCreateParty = () => {
    navigate(ROUTES.createPartyCharacter, {
      state: {
        hostName,
        partyDate: selectedDate.toISOString(),
        partyTime: selectedTime,
        startedDate: formatIsoDate(selectedDate),
        startTime: formatStartTime(timePickerValue),
      },
    });
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

      <H1 className="relative z-10 mt-2 px-5 tracking-[-0.0002em]">
        파티 초대장 내용을 완성해 주세요
      </H1>

      <div className="relative mt-[clamp(44px,7vh,72px)] [@media_(min-height:900px)]:mt-[120px]">
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
                <span className="inline-flex items-center gap-x-1.5 whitespace-nowrap">
                  <EditableNamePill
                    value={hostName}
                    fallbackValue={defaultHostName}
                    onChange={setHostName}
                  />
                  <span className="text-head-3">{hostNameParticle} 위해</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <span ref={datePillRef} className="inline-flex">
                  <HighlightPill
                    variant={isDatePickerOpen ? 'active' : 'filled'}
                    icon={
                      isDatePickerOpen ? (
                        <CalendarColorIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      ) : (
                        <CalendarMonoIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      )
                    }
                    onClick={handleOpenDatePicker}
                  >
                    {formatKoreanDate(selectedDate)}
                  </HighlightPill>
                </span>
                <span className="text-head-3">에</span>
              </div>
              <div className="relative flex flex-nowrap items-center gap-x-1.5">
                <span ref={timePillRef} className="inline-flex">
                  <HighlightPill
                    variant={isTimePickerOpen ? 'active' : selectedTime ? 'filled' : 'outlined'}
                    icon={
                      isTimePickerOpen || !selectedTime ? (
                        <ClockColorIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      ) : (
                        <ClockMonoIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      )
                    }
                    onClick={handleOpenTimePicker}
                  >
                    {isTimePickerOpen ? pendingTime : (selectedTime ?? '시간선택')}
                  </HighlightPill>
                </span>
                <span className="text-head-3 shrink-0">부터 {PARTY_DURATION_MINUTES}분 동안</span>
                {showTimeTooltip && !hasOpenedTimePicker && (
                  <div className="pointer-events-none absolute top-[52px] left-12 z-20 flex h-14 w-[131px] items-center rounded-xl bg-[#000341] px-3 py-2 text-[13px] leading-[20px] font-semibold whitespace-nowrap text-white shadow-[0px_4px_12px_0px_#00000033]">
                    <span className="absolute -top-1.5 left-5 h-3 w-3 rotate-45 bg-[#000341]" />
                    <span className="relative z-10">
                      원하는 파티 시간을
                      <br />
                      선택해 주세요!
                    </span>
                  </div>
                )}
              </div>
              <span className="text-head-3">온라인 생일 파티가 열려요</span>
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
              {timePickerOptions.period.map((option) => (
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
              {timePickerOptions.hour.map((option) => (
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
              {timePickerOptions.minute.map((option) => (
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
