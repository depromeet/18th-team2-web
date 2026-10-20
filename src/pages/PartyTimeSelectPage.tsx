import { useEffect, useMemo, useState } from 'react';
import Picker from 'react-mobile-picker';
import { useNavigate } from 'react-router-dom';
import CalendarColorIcon from '@/assets/images/icons/calendar-color.svg?react';
import CalendarMonoIcon from '@/assets/images/icons/calendar-mono.svg?react';
import ClockColorIcon from '@/assets/images/icons/clock-color.svg?react';
import ClockMonoIcon from '@/assets/images/icons/clock-mono.svg?react';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1, L1 } from '@/components/ui/Typography';
import { AnchoredPopover } from '@/components/party-create/AnchoredPopover';
import { DatePickerPopover } from '@/components/party-create/DatePickerPopover';
import { EditableNamePill } from '@/components/party-create/EditableNamePill';
import { HighlightPill } from '@/components/party-create/HighlightPill';
import { InvitationCard } from '@/components/party-create/InvitationCard';
import { LivePartyOnboarding } from '@/components/party-create/LivePartyOnboarding';
import { LoginPromptSheet } from '@/components/ui/LoginPromptSheet';
import { StackedInvitationBackdrop } from '@/components/party-create/StackedInvitationBackdrop';
import { PARTY_DURATION_MINUTES } from '@/constants/partyCreate';
import { ROUTES } from '@/constants/routes';
import { useAnchoredOverlay } from '@/hooks/useAnchoredOverlay';
import { useCreateHostName } from '@/hooks/useCreateHostName';
import { useMe } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  formatDisplayTime,
  formatDotDate,
  formatIsoDate,
  formatKoreanDate,
  getTodayMidnight,
} from '@/utils/date';

type PickerMode = 'date' | 'time' | null;

interface TimePickerValue {
  [key: string]: string | number;
  period: string;
  hour: string;
  minute: string;
}

const TIME_PICKER_MINUTE_STEP = 5;

// 비회원이 파티 생성 시 로그인하러 다녀오는 동안 입력값을 보존한다
const TIME_SELECT_DRAFT_KEY = 'party-time-select-draft';

interface TimeSelectDraft {
  selectedDate: string | null;
  selectedTime: string | null;
  timePickerValue: TimePickerValue;
  hostName: string;
}

function readTimeSelectDraft(): TimeSelectDraft | null {
  try {
    const raw = window.sessionStorage.getItem(TIME_SELECT_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as TimeSelectDraft) : null;
  } catch {
    return null;
  }
}

function saveTimeSelectDraft(draft: TimeSelectDraft) {
  try {
    window.sessionStorage.setItem(TIME_SELECT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // 저장소 접근이 막힌 환경에서는 로그인 후 입력값이 초기화된다
  }
}

function clearTimeSelectDraft() {
  try {
    window.sessionStorage.removeItem(TIME_SELECT_DRAFT_KEY);
  } catch {
    /* empty */
  }
}

const TIME_PICKER_OPTIONS = {
  period: ['오전', '오후'],
  hour: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  minute: Array.from({ length: 60 / TIME_PICKER_MINUTE_STEP }, (_, index) =>
    String(index * TIME_PICKER_MINUTE_STEP).padStart(2, '0'),
  ),
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
  const nextTime = new Date(now);
  nextTime.setSeconds(0, 0);

  const minute = nextTime.getMinutes();
  const remainder = minute % TIME_PICKER_MINUTE_STEP;
  const hasPassedCurrentMinute = nextTime.getTime() < now.getTime();

  if (remainder !== 0) {
    nextTime.setMinutes(minute + (TIME_PICKER_MINUTE_STEP - remainder));
  } else if (hasPassedCurrentMinute) {
    nextTime.setMinutes(minute + TIME_PICKER_MINUTE_STEP);
  }

  const hour24 = nextTime.getHours();

  return {
    period: hour24 < 12 ? '오전' : '오후',
    hour: String(hour24 % 12 === 0 ? 12 : hour24 % 12),
    minute: String(nextTime.getMinutes()).padStart(2, '0'),
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: meData, isLoading: isMeLoading } = useMe();

  const { defaultHostName, hostName, setHostName } = useCreateHostName(meData?.data?.name);
  const today = getTodayMidnight();
  const [draft] = useState(readTimeSelectDraft);

  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    draft?.selectedDate ? new Date(draft.selectedDate) : today,
  );
  // 기본 날짜를 노출하지 않고 사용자가 직접 고르게 한다. 고르기 전에는 오늘 기준으로 시간 선택지를 계산한다
  const [hasSelectedDate, setHasSelectedDate] = useState(() => Boolean(draft?.selectedDate));
  const [selectedTime, setSelectedTime] = useState<string | null>(
    () => draft?.selectedTime ?? null,
  );
  const [pendingTime, setPendingTime] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [timePickerValue, setTimePickerValue] = useState<TimePickerValue>(
    () => draft?.timePickerValue ?? getNearestTimePickerValue(),
  );
  // required: 파티 만들기 버튼에서 로그인 유도 / resume: 로그인 도중 돌아왔을 때 이어서 로그인 유도
  const [loginPromptMode, setLoginPromptMode] = useState<'required' | 'resume' | null>(null);
  const isReady = Boolean(hostName && hasSelectedDate && selectedTime);
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
    if (!draft) return;
    if (draft.hostName) setHostName(draft.hostName);

    if (isAuthenticated) {
      clearTimeSelectDraft();
      return;
    }

    // 카카오 로그인 화면에서 완료하지 않고 돌아온 경우 — 입력값은 복원하고 이어서 로그인을 권한다
    useAuthStore.getState().setRedirectUrl(ROUTES.createPartyTime);
    setLoginPromptMode('resume');
    // 마운트 시 한 번만 복원한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setHasSelectedDate(true);
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

  // 시트를 닫으면 로그인하지 않기로 한 것이므로 저장해 둔 입력값과 로그인 후 이동 경로를 비우고 화면에 남는다
  const handleCloseLoginPrompt = () => {
    clearTimeSelectDraft();
    useAuthStore.getState().clearRedirectUrl();
    setLoginPromptMode(null);
  };

  const handleCreateParty = () => {
    if (!isAuthenticated) {
      saveTimeSelectDraft({
        selectedDate: hasSelectedDate ? selectedDate.toISOString() : null,
        selectedTime,
        timePickerValue,
        hostName,
      });
      useAuthStore.getState().setRedirectUrl(ROUTES.createPartyTime);
      setLoginPromptMode('required');
      return;
    }

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
    <div className="bg-gradient-bg relative flex min-h-dvh flex-col">
      {isMeLoading && <Loading />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-[38vh] bg-gradient-to-b from-[#EEF5FF]/0 via-[#EEF5FF] to-[#F5F9FF]"
      />
      <div className="relative z-10">
        <PageHeader />
      </div>

      <H1 className="relative z-10 mt-2 px-5 tracking-[-0.0002em]">
        나만의 온라인 생일파티를 <br />
        만들어볼까요?
      </H1>

      <div className="relative mt-[clamp(36px,7svh,72px)]">
        {pickerMode && (
          <button
            type="button"
            aria-label="선택창 닫기"
            className="fixed inset-0 z-40 cursor-default"
            onClick={handleClosePicker}
          />
        )}
        <div className="relative z-10 flex justify-center">
          <InvitationCard
            title="파티 초대장"
            footerDate={hasSelectedDate ? formatDotDate(selectedDate) : ''}
          >
            <div className="text-head-1 text-grey-600 relative flex flex-col gap-3 font-normal tracking-[-0.0002em]">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <span className="inline-flex items-center gap-x-1.5 whitespace-nowrap">
                  <EditableNamePill
                    value={hostName}
                    fallbackValue={defaultHostName}
                    onChange={setHostName}
                  />
                  <span className="text-head-3">님을 위해</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <span ref={datePillRef} className="inline-flex">
                  <HighlightPill
                    variant={isDatePickerOpen ? 'active' : hasSelectedDate ? 'filled' : 'outlined'}
                    icon={
                      isDatePickerOpen || !hasSelectedDate ? (
                        <CalendarColorIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      ) : (
                        <CalendarMonoIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      )
                    }
                    onClick={handleOpenDatePicker}
                  >
                    {hasSelectedDate ? formatKoreanDate(selectedDate) : '날짜선택'}
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
              </div>
              <span className="text-head-3">온라인 생일 파티가 열려요</span>
            </div>
          </InvitationCard>
        </div>
        <StackedInvitationBackdrop />
      </div>

      {isDatePickerOpen && datePickerPosition && (
        <DatePickerPopover
          selectedDate={hasSelectedDate ? selectedDate : undefined}
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

      <div className="party-time-touch-tablet-action pb-safe-bottom-4 relative z-30 mt-auto px-5 pt-12">
        <div className="relative">
          {!isAuthenticated && (
            <div className="absolute bottom-full left-1/2 z-30 -mb-2 -translate-x-1/2">
              <div className="rolling-paper-share-tooltip bg-blue-1000 relative flex w-max items-center justify-center rounded-xl px-3 py-2 whitespace-nowrap">
                <L1 className="font-bold! text-white">
                  파티생성 링크를 만들려면 로그인이 필요해요
                </L1>
                <span
                  aria-hidden
                  className="border-t-blue-1000 absolute -bottom-1.75 left-4 h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent"
                />
              </div>
            </div>
          )}
          <Button
            variant={isReady ? 'primary' : 'secondary'}
            size="full"
            disabled={!isReady}
            onClick={handleCreateParty}
          >
            파티 만들기
          </Button>
        </div>
      </div>
      <LivePartyOnboarding />
      <LoginPromptSheet
        titlePrefix="주인공으로 파티에 입장하려면"
        isOpen={loginPromptMode !== null}
        onClose={handleCloseLoginPrompt}
        title={loginPromptMode === 'resume' ? '이어서 로그인할까요?' : undefined}
        description={
          loginPromptMode === 'resume'
            ? '로그인하면 1초만에 생성이 완료돼요'
            : '로그인하면 링크로 언제든 다시 입장할 수 있어요'
        }
      />
    </div>
  );
}
