const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const HANGUL_FINAL_CONSONANT_COUNT = 28;

function hasFinalConsonant(text: string): boolean {
  const chars = Array.from(text.trim());
  const lastCharacter = chars[chars.length - 1];

  if (!lastCharacter) return false;

  const codePoint = lastCharacter.codePointAt(0);

  if (
    codePoint === undefined ||
    codePoint < HANGUL_SYLLABLE_START ||
    codePoint > HANGUL_SYLLABLE_END
  ) {
    return false;
  }

  return (codePoint - HANGUL_SYLLABLE_START) % HANGUL_FINAL_CONSONANT_COUNT !== 0;
}

export function getObjectParticle(text: string): '을' | '를' {
  return hasFinalConsonant(text) ? '을' : '를';
}
