import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';
import { usePartyMusic } from '@/hooks/live-party/usePartyMusic';

class MockAudio {
  static instances: MockAudio[] = [];

  currentTime = 0;
  loop = false;
  muted = false;
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);

  constructor() {
    MockAudio.instances.push(this);
  }
}

interface HookProps {
  step: PartyStep;
  enabled: boolean;
}

beforeEach(() => {
  MockAudio.instances = [];
  vi.stubGlobal('Audio', MockAudio);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePartyMusic', () => {
  it('진행 단계에서 재생하고 ENTRY로 돌아오면 음악을 처음부터 정지한다', () => {
    const { rerender } = renderHook(
      ({ step, enabled }: HookProps) => usePartyMusic({ step, enabled }),
      { initialProps: { step: LIVE_PARTY_STEP.MUSIC, enabled: true } as HookProps },
    );
    const audio = MockAudio.instances[0];
    audio.currentTime = 10;

    expect(audio.play).toHaveBeenCalledTimes(1);

    rerender({ step: LIVE_PARTY_STEP.ENTRY, enabled: true });

    expect(audio.pause).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(0);
  });

  it('대기 화면처럼 재생이 비활성화되면 현재 음악을 정지한다', () => {
    const { rerender } = renderHook(
      ({ step, enabled }: HookProps) => usePartyMusic({ step, enabled }),
      { initialProps: { step: LIVE_PARTY_STEP.MUSIC, enabled: true } as HookProps },
    );
    const audio = MockAudio.instances[0];

    rerender({ step: LIVE_PARTY_STEP.MUSIC, enabled: false });

    expect(audio.pause).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(0);
  });

  it('파티 화면을 벗어나 훅이 해제되면 음악을 정지한다', () => {
    const { unmount } = renderHook(() =>
      usePartyMusic({ step: LIVE_PARTY_STEP.MUSIC, enabled: true }),
    );
    const audio = MockAudio.instances[0];

    unmount();

    expect(audio.pause).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(0);
  });
});
