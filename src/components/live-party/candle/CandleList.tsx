import { CandleItem } from '@/components/live-party/candle/CandleItem';

interface Candle {
  on: string;
  off: string;
}

interface CandleListProps {
  candles: Candle[];
  isCandleOffList: boolean[];
  onClickCandle: (index: number) => void;
}

export function CandleList({ candles, isCandleOffList, onClickCandle }: CandleListProps) {
  return (
    <div className="relative grid grid-cols-3 gap-y-[30px]">
      {candles.map((candle, index) => {
        const isOff = isCandleOffList[index];

        return (
          <CandleItem
            key={index}
            src={isOff ? candle.off : candle.on}
            alt={`촛불-${index}`}
            disabled={isOff}
            onClick={() => onClickCandle(index)}
          />
        );
      })}
    </div>
  );
}
