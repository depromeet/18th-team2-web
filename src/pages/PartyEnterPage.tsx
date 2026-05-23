import { Button } from '@/components/ui/Button';
import { CharacterSelect } from '@/components/party-enter/CharacterSelect';
import { ParticipantStatus } from '@/components/party-enter/ParticipantStatus';
import { NicknameInput } from '@/components/ui/NicknameInput';
import { PageHeader } from '@/components/ui/PageHeader';
import { B2, H1 } from '@/components/ui/Typography';
import { usePartyEnter } from '@/hooks/partyEnter/usePartyEnter';
import { MOCK_PARTICIPANTS } from '@/services/party-enter';

export default function PartyEnterPage() {
  const {
    title,
    isHost,
    isPending,
    isTimeToParty,
    countdown,
    inputValue,
    isNicknameEditable,
    inputMessage,
    isInputError,
    selectedCharacterId,
    handleChangeNickname,
    handleSelectCharacter,
    handleSubmit,
  } = usePartyEnter();

  return (
    <section className="flex min-h-screen flex-col">
      <PageHeader />
      <main className="flex flex-1 flex-col justify-between gap-6 p-4">
        <form className="flex flex-1 flex-col justify-between gap-6" onSubmit={handleSubmit}>
          <article className="flex w-full flex-col gap-4">
            <H1 className="whitespace-pre-line">{title}</H1>
            <NicknameInput
              value={inputValue}
              placeholder="파티에 등장할 닉네임을 입력해 주세요."
              disabled={!isNicknameEditable}
              error={isInputError}
              message={inputMessage}
              onChange={handleChangeNickname}
            />
          </article>
          <section className="flex h-[236px] w-full flex-col items-center justify-center gap-5">
            <CharacterSelect value={selectedCharacterId} onSelect={handleSelectCharacter} />
          </section>
          <footer className="flex w-full flex-col items-center gap-2">
            {countdown && (
              <B2 className="text-grey-500 font-medium">
                파티 시작까지{' '}
                <span className="text-red-500">
                  {countdown.minutes}분 {countdown.seconds}초
                </span>{' '}
                남았어요
              </B2>
            )}
            {isHost && <ParticipantStatus participants={MOCK_PARTICIPANTS} />}
            <Button type="submit" disabled={!isTimeToParty || !inputValue || isPending}>
              파티 입장하러 가기
            </Button>
          </footer>
        </form>
      </main>
    </section>
  );
}
