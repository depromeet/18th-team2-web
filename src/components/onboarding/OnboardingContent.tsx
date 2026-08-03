import { H1, H3 } from '@/components/ui/Typography';

interface OnboardingContentProps {
  imageSrc: string;
  text: { bigText: string; smallText: string };
}

export function OnboardingContent({ imageSrc, text }: OnboardingContentProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-9">
      <img
        src={imageSrc}
        alt="온보딩 이미지"
        className="h-80 w-85.75 mask-[linear-gradient(to_right,transparent_0%,black_15%,black_95%,transparent_100%),linear-gradient(to_bottom,black_95%,transparent_100%)] mask-intersect"
      />
      <div className="flex flex-col gap-1">
        <H1 className="text-center whitespace-pre-line text-white" as="p">
          {text.bigText}
        </H1>
        <H3 className="text-center font-semibold text-white" as="p">
          {text.smallText}
        </H3>
      </div>
    </div>
  );
}
