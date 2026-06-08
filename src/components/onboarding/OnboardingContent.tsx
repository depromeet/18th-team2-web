import { H1, H3 } from '@/components/ui/Typography';

interface OnboardingContentProps {
  imageSrc: string;
  text: { bigText: string; smallText: string };
}

export function OnboardingContent({ imageSrc, text }: OnboardingContentProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-9">
      <img src={imageSrc} alt="온보딩 이미지" className="h-80 w-[343px]" />
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
