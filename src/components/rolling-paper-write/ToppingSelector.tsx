import candleImg from '@/assets/images/topping-candle.png';
import cherryImg from '@/assets/images/topping-cherry.png';
import strawberryImg from '@/assets/images/topping-strawberry.png';
import { L1 } from '@/components/ui/Typography';
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
    <div className="flex gap-3 overflow-x-auto pb-2" role="radiogroup" aria-label="편지지 선택">
      {TOPPINGS.map((topping) => {
        const isSelected = value === topping.id;
        return (
          <button
            key={topping.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(topping.id)}
            className={`flex min-w-[88px] flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-colors ${
              isSelected ? 'border-blue-500 bg-blue-30' : 'border-grey-100 bg-white'
            }`}
          >
            <img src={topping.image} alt={topping.label} className="h-14 w-14 object-contain" />
            <L1 className={isSelected ? 'text-blue-500' : 'text-grey-500'}>{topping.label}</L1>
          </button>
        );
      })}
    </div>
  );
}
