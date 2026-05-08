import { T3 } from '@/components/ui/Typography';

interface CandleTitleProps {
  allCandleOff: boolean;
}

export function CandleTitle({ allCandleOff }: CandleTitleProps) {
  return (
    <T3 className="relative text-center text-white">
      {allCandleOff ? (
        <>
          후~ <br />
          모든 촛불이 꺼졌어요
        </>
      ) : (
        <>
          촛불을 클릭해서 <br />
          모두 꺼 주세요
        </>
      )}
    </T3>
  );
}
