import { DayPicker } from 'react-day-picker';
import { AnchoredPopover } from '@/components/party-create/AnchoredPopover';

interface DatePickerPopoverProps {
  selectedDate: Date;
  minDate: Date;
  position: {
    top: number;
    left: number;
  };
  onSelectDate: (date: Date | undefined) => void;
}

export function DatePickerPopover({
  selectedDate,
  minDate,
  position,
  onSelectDate,
}: DatePickerPopoverProps) {
  return (
    <AnchoredPopover position={position} className="px-4 py-3">
      <DayPicker
        mode="single"
        selected={selectedDate}
        defaultMonth={selectedDate}
        disabled={{ before: minDate }}
        onSelect={onSelectDate}
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
          day_button: 'h-7 w-7 rounded-full text-body-1 text-white disabled:text-grey-300',
          selected: '[&>button]:bg-white [&>button]:font-semibold [&>button]:text-blue-500',
          disabled: '[&>button]:text-grey-300',
          outside: '[&>button]:text-grey-300',
        }}
      />
    </AnchoredPopover>
  );
}
