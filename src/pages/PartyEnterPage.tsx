import { Button } from '@/components/ui/Button';
import { CharacterSelect } from '@/components/party-enter/CharacterSelect';
import { ErrorCircleFilledIcon } from '@/components/ui/icons/ErrorCircleFilledIcon';
import { NicknameInput } from '@/components/ui/NicknameInput';
import { PageHeader } from '@/components/ui/PageHeader';
import { B2, H1 } from '@/components/ui/Typography';
import { usePartyEnter } from '@/hooks/partyEnter/usePartyEnter';
import { ParticipantStatus } from '@/components/party-enter/ParticipantStatus';

export default function PartyEnterPage() {
  const {
    title,
    isHost,
    isPending,
    countdown,
    hasPartyStarted,
    isPartyFull,
    inputValue,
    guestParticipants,
    isNicknameEditable,
    inputMessage,
    isInputError,
    selectedCharacterId,
    handleChangeNickname,
    handleSelectCharacter,
    handleSubmit,
  } = usePartyEnter();

  return (
    <section className="flex min-h-dvh flex-col">
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
          <section className="flex h-59 w-full flex-col items-center justify-center gap-5">
            <CharacterSelect value={selectedCharacterId} onSelect={handleSelectCharacter} />
          </section>
          <footer className="flex w-full flex-col items-center gap-2">
            {countdown && (
              <B2 className="text-grey-500 font-medium">
                <span className="text-red-500">
                  {countdown.minutes}분 {countdown.seconds}초
                </span>{' '}
                후에 입장할 수 있어요
              </B2>
            )}
            {hasPartyStarted && !isHost && (
              <B2 className="text-center font-medium text-blue-700">파티가 이미 진행 중이에요!</B2>
            )}
            {isHost && <ParticipantStatus participants={guestParticipants} />}
            {isPartyFull && (
              <div className="bg-red-30 flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-2">
                <ErrorCircleFilledIcon width={20} height={20} aria-hidden="true" />
                <B2 className="font-medium text-red-500">참가자가 모두 차서 입장이 불가능해요</B2>
              </div>
            )}
            <Button
              type="submit"
              disabled={!inputValue || isPending || isInputError || isPartyFull || !!countdown}
            >
              파티 입장하러 가기
            </Button>
          </footer>
        </form>
      </main>
    </section>
  );
}
