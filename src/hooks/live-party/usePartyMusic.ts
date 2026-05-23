import { useEffect, useRef, useState } from 'react';

import happyBirthdayMusic from '@/assets/music/happy-birthday.mp3';

import { LIVE_PARTY_STEP, MUSIC_GUIDE_DURATION, type PartyStep } from '@/constants/live-party';

interface UsePartyMusicParams {
  step: PartyStep;
}

export function usePartyMusic({ step }: UsePartyMusicParams) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [musicIsMuted, setMusicIsMuted] = useState(false);

  const handleToggleMute = () => {
    setMusicIsMuted((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(happyBirthdayMusic);
      audioRef.current.loop = true;
    }

    if (step === LIVE_PARTY_STEP.END) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      return;
    }

    if (step === LIVE_PARTY_STEP.ENTRY) {
      return;
    }

    const timer = window.setTimeout(() => {
      void audioRef.current?.play();
    }, MUSIC_GUIDE_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [step]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.muted = musicIsMuted;
  }, [musicIsMuted]);

  return {
    musicIsMuted,
    handleToggleMute,
  };
}
