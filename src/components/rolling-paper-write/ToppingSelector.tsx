import CheckCircleFilledIcon from '@/assets/images/icons/check-circle-filled.svg?react';
import candleImg from '@/assets/images/rolling-paper/topping-candle.png';
import cherryImg from '@/assets/images/rolling-paper/topping-cherry.png';
import strawberryImg from '@/assets/images/rolling-paper/topping-strawberry.png';
import type { ToppingType } from '@/services/rolling-paper';

interface ToppingOption {
  id: ToppingType;
  label: string;
  image: string;
}

const TOPPINGS: ToppingOption[] = [
  { id: 'cherry', label: '체리', image: cherryImg },
  { id: 'strawberry', label: '딸기', image: strawberryImg },
  { id: 'candle', label: '캔들', image: candleImg },
];

interface ToppingSelectorProps {
  value: ToppingType | null;
  onChange: (topping: ToppingType) => void;
}

export function ToppingSelector({ value, onChange }: ToppingSelectorProps) {
  return (
    <div
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      role="radiogroup"
      aria-label="토핑 선택"
    >
      {TOPPINGS.map((topping) => {
        const isSelected = value === topping.id;
        return (
          <button
            key={topping.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(topping.id)}
            className={`relative flex h-30 w-30 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isSelected ? 'bg-blue-30' : 'bg-white'
            }`}
            style={{
              border: isSelected ? '2px solid #5892FF' : '2px solid #DCDCDC',
            }}
          >
            <img src={topping.image} alt={topping.label} className="h-22.5 w-22.5 object-contain" />
            {isSelected && (
              <CheckCircleFilledIcon
                width={28}
                height={28}
                className="absolute right-2.5 bottom-2.5"
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
