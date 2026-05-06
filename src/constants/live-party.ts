/** 파티 인트로 */
export interface EntryData {
  text: string;
  showButton?: boolean;
}

export const ENTRY_DATA: EntryData[] = [
  {
    text: `현진님의\n생일파티에\n오신 걸 환영해요!`,
  },
  {
    text: `소중한 시간을 내어\n방문해 주셔서 고마워요`,
  },
  {
    text: `이 생일파티는\n[5분] 정도 짧게 진행돼요`,
  },
  {
    text: `축하의 마음을\n남기는 것만으로도\n최고의 선물이 될 거에요!`,
  },
  {
    text: `축하할 준비가 됐다면\n이제 시작할게요`,
  },
  {
    text: `두근두근\n[커튼]을 열어볼까요?`,
    showButton: true,
  },
];
