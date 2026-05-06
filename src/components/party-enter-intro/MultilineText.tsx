import { HighlightedText } from '@/components/party-enter-intro/HighlightedText';

interface MultilineTextProps {
  text: string;
}

export function MultilineText({ text }: MultilineTextProps) {
  return (
    <>
      {text.split('\n').map((line, index) => (
        <span key={index}>
          <HighlightedText string={line} />
          <br />
        </span>
      ))}
    </>
  );
}
