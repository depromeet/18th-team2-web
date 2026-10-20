import { useCallback, useEffect, useRef, useState } from 'react';

import happyBirthdayMusic from '@/assets/music/happy-birthday.mp3';

import { LIVE_PARTY_STEP, type PartyStep } from '@/constants/live-party';

interface UsePartyMusicParams {
  step: PartyStep;
  enabled?: boolean;
}

export function usePartyMusic({ step, enabled = true }: UsePartyMusicParams) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [musicIsMuted, setMusicIsMuted] = useState(false);

  const stopMusic = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const handleToggleMute = useCallback(() => {
    setMusicIsMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    return () => {
      stopMusic();
      audioRef.current = null;
    };
  }, [stopMusic]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(happyBirthdayMusic);
      audioRef.current.loop = true;
    }

    if (!enabled || step === LIVE_PARTY_STEP.ENTRY || step === LIVE_PARTY_STEP.END) {
      stopMusic();
      return;
    }

    void audioRef.current.play();
  }, [enabled, step, stopMusic]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.muted = musicIsMuted;
  }, [musicIsMuted]);

  return {
    musicIsMuted,
    handleToggleMute,
    stopMusic,
  };
}
