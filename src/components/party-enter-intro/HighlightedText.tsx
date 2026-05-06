interface HighlightedTextProps {
  string: string;
}

export function HighlightedText({ string }: HighlightedTextProps) {
  const match = string.match(/\[(.*?)\]/);

  if (!match) return string;

  const word = match[1];
  const [before, after] = string.split(`[${word}]`);

  return (
    <>
      {before}
      <span className="text-blue-500">{word}</span>
      {after}
    </>
  );
}
