import CandleCharacter from '@/assets/images/party-enter/candle-character.svg?react';
import CandleThumbnail from '@/assets/images/party-enter/candle-thumbnail.svg?react';
import ChocoCharacter from '@/assets/images/party-enter/choco-character.svg?react';
import ChocoThumbnail from '@/assets/images/party-enter/choco-thumbnail.svg?react';
import CloudCharacter from '@/assets/images/party-enter/cloud-character.svg?react';
import CloudThumbnail from '@/assets/images/party-enter/cloud-thumbnail.svg?react';
import DefaultCharacter from '@/assets/images/party-enter/default-character.svg?react';
import DefaultThumbnail from '@/assets/images/party-enter/default-thumbnail.svg?react';
import RibbonCharacter from '@/assets/images/party-enter/ribbon-character.svg?react';
import RibbonThumbnail from '@/assets/images/party-enter/ribbon-thumbnail.svg?react';

export type CharacterType = 'default' | 'ribbon' | 'choco' | 'candle' | 'cloud';

export const CHARACTERS = [
  {
    type: 'default' as CharacterType,
    label: '기본',
    Thumbnail: DefaultThumbnail,
    Character: DefaultCharacter,
  },
  {
    type: 'ribbon' as CharacterType,
    label: '리본',
    Thumbnail: RibbonThumbnail,
    Character: RibbonCharacter,
  },
  {
    type: 'choco' as CharacterType,
    label: '초코',
    Thumbnail: ChocoThumbnail,
    Character: ChocoCharacter,
  },
  {
    type: 'candle' as CharacterType,
    label: '양초',
    Thumbnail: CandleThumbnail,
    Character: CandleCharacter,
  },
  {
    type: 'cloud' as CharacterType,
    label: '구름',
    Thumbnail: CloudThumbnail,
    Character: CloudCharacter,
  },
] as const;
