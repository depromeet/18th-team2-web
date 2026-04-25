import { H1 } from '@/components/ui/Typography';

interface OnboardingContentProps {
  imageSrc: string;
  text: string;
}

export function OnboardingContent({ imageSrc, text }: OnboardingContentProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-9">
      <img src={imageSrc} alt="온보딩 이미지" />
      <H1 className="text-center whitespace-pre-line text-white">{text}</H1>
    </div>
  );
}
