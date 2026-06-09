import { H4, T3 } from '@/components/ui/Typography';

interface CandleTitleProps {
  allCandleOff: boolean;
}

export function CandleTitle({ allCandleOff }: CandleTitleProps) {
  return (
    <>
      {allCandleOff ? (
        <T3 className="relative text-center text-white">
          후~ <br />
          모든 촛불이 꺼졌어요
        </T3>
      ) : (
        <div className="relative flex flex-col gap-3 text-center">
          <T3 className="text-white">촛불을 눌러서 꺼주세요!</T3>
          <H4 className="text-grey-200">참여자 모두가 함께 끌 수 있어요</H4>
        </div>
      )}
    </>
  );
}
