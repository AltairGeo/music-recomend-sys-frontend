import { useEffect, useRef, useState } from "react";
import { Group, ActionIcon, Slider, Text } from "@mantine/core";

import { PlayIcon, PauseIcon, SpeakerHighIcon } from "@phosphor-icons/react";

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(15);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;

    const onTime = () => setTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }

    setPlaying(!playing);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value;
    setTime(value);
  };

  const changeVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(value);
    audio.volume = value / 100;
  };

  return (
    <Group gap="md" align="center">
      {/* play / pause */}
      <ActionIcon size="lg" onClick={toggle}>
        {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </ActionIcon>

      {/* progress */}
      <Slider
        value={time}
        onChange={seek}
        max={duration || 1}
        style={{ flex: 1 }}
        label={(v) => {
          return Math.ceil(v);
        }}
      />

      {/* time */}
      <Text size="sm" c="dimmed" w={110}>
        {Math.floor(time)}s / {Math.floor(duration)}s
      </Text>

      {/* volume */}
      <Group gap={6} align="center">
        <SpeakerHighIcon size={20} />

        <Slider
          value={volume}
          onChange={changeVolume}
          w={100}
          min={0}
          max={100}
        />
      </Group>

      <audio ref={audioRef} src={src} />
    </Group>
  );
}
