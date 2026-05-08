import characterBlueCircle from '@/assets/images/character/character-blue-circle-thumbnail.png';
import characterBlueFull from '@/assets/images/character/character-blue-full.png';
import characterBrownCircle from '@/assets/images/character/character-brown-circle-thumbnail.png';
import characterBrownFull from '@/assets/images/character/character-brown-full.png';
import characterPinkCircle from '@/assets/images/character/character-pink-circle-thumbnail.png';
import characterPinkFull from '@/assets/images/character/character-pink-full.png';
import characterWhiteCircle from '@/assets/images/character/character-white-circle-thumbnail.png';
import characterWhiteFull from '@/assets/images/character/character-white-full.png';
import characterYellowCircle from '@/assets/images/character/character-yellow-circle-thumbnail.png';
import characterYellowFull from '@/assets/images/character/character-yellow-full.png';

export type CharacterType = 'blue' | 'brown' | 'pink' | 'white' | 'yellow';

export const CHARACTERS = [
  {
    type: 'blue' as CharacterType,
    label: '기본',
    thumbnail: characterBlueCircle,
    character: characterBlueFull,
  },

  {
    type: 'pink' as CharacterType,
    label: '리본',
    thumbnail: characterPinkCircle,
    character: characterPinkFull,
  },
  {
    type: 'brown' as CharacterType,
    label: '초코',
    thumbnail: characterBrownCircle,
    character: characterBrownFull,
  },
  {
    type: 'yellow' as CharacterType,
    label: '양초',
    thumbnail: characterYellowCircle,
    character: characterYellowFull,
  },
  {
    type: 'white' as CharacterType,
    label: '구름',
    thumbnail: characterWhiteCircle,
    character: characterWhiteFull,
  },
] as const;
