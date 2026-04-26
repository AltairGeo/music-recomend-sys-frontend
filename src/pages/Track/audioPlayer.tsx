import { useEffect, useRef, useState } from "react";
import { Group, ActionIcon, Slider, Text } from "@mantine/core";
import { PlayIcon, PauseIcon, SpeakerHighIcon } from "@phosphor-icons/react";

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const seekingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [draftTime, setDraftTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(15);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const onTime = () => {
      if (!seekingRef.current) {
        setTime(audio.currentTime);
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    const onEnd = () => {
      seekingRef.current = false;
      setPlaying(false);
      setTime(0);
      setDraftTime(null);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (e) {
      console.error("Audio play error:", e);
    }
  };

  const beginSeek = () => {
    seekingRef.current = true;
  };

  const seek = (value: number) => {
    setDraftTime(value);
  };

  const seekEnd = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const doSeek = () => {
      audio.currentTime = value;
      setTime(value);
    };

    if (audio.readyState >= 1) {
      doSeek();
    } else {
      audio.addEventListener("loadedmetadata", doSeek, { once: true });
    }
  };

  const currentValue = draftTime ?? time;

  return (
    <Group gap="md" align="center">
      <ActionIcon size="lg" onClick={toggle}>
        {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </ActionIcon>

      <Slider
        value={currentValue}
        onPointerDown={beginSeek}
        onMouseDown={beginSeek}
        onTouchStart={beginSeek}
        onChange={seek}
        onChangeEnd={seekEnd}
        max={duration || 1}
        style={{ flex: 1 }}
        label={(v) => `${Math.floor(v)}s`}
      />

      <Text size="sm" c="dimmed" w={110}>
        {Math.floor(currentValue)}s / {Math.floor(duration)}s
      </Text>

      <Group gap={6} align="center">
        <SpeakerHighIcon size={20} />
        <Slider
          value={volume}
          onChange={(v) => setVolume(v)}
          w={100}
          min={0}
          max={100}
        />
      </Group>

      <audio ref={audioRef} src={src} preload="metadata" />
    </Group>
  );
}
