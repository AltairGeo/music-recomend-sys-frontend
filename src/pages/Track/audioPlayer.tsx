import { useEffect, useRef, useState } from "react";
import { ActionIcon, Group, Slider, Stack, Text } from "@mantine/core";
import { Popover } from "@mantine/core";
import { PauseIcon, PlayIcon, SpeakerHighIcon } from "@phosphor-icons/react";

interface Props {
  src: string;
}

function formatTime(time: number) {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const [dragging, setDragging] = useState(false);

  const [volume, setVolume] = useState(50);

  const [volumeOpened, setVolumeOpened] = useState(false);

  // volume sync
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  // audio listeners
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
    };

    const onTime = () => {
      if (!dragging) {
        setCurrent(audio.currentTime);
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    const onEnded = () => {
      setPlaying(false);
      setCurrent(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [dragging]);

  // reset when src changes
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    setPlaying(false);
    setCurrent(0);
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const handleSeek = (value: number) => {
    setDragging(true);
    setCurrent(value);
  };

  const handleSeekEnd = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;

    setCurrent(value);
    setDragging(false);
  };

  return (
    <Group gap="xs" style={{ display: "flex" }}>
      <Group wrap="nowrap" style={{ flex: "1", marginTop: "auto" }}>
        <ActionIcon size="lg" radius="xl" variant="light" onClick={toggle}>
          {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </ActionIcon>

        <div
          style={{
            width: "100%",
            alignItems: "center",
            verticalAlign: "center",
          }}
        >
          <Slider
            value={current}
            onChange={handleSeek}
            onChangeEnd={handleSeekEnd}
            min={0}
            max={duration || 1}
            step={0.1}
            flex={1}
            label={null}
          />

          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {formatTime(current)}
            </Text>

            <Text size="xs" c="dimmed">
              {formatTime(duration)}
            </Text>
          </Group>
        </div>
      </Group>

      <Popover
        opened={volumeOpened}
        onChange={setVolumeOpened}
        position="top"
        withArrow
      >
        <Popover.Target>
          <ActionIcon
            size="lg"
            radius="xl"
            variant="light"
            onClick={() => setVolumeOpened((v) => !v)}
          >
            <SpeakerHighIcon size={18} />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown>
          <Popover.Dropdown>
            <Stack align="center" gap="xs">
              <Slider
                orientation="vertical"
                value={volume}
                onChange={setVolume}
                min={0}
                max={100}
                step={1}
                h={100}
                label={null}
              />
            </Stack>
          </Popover.Dropdown>
        </Popover.Dropdown>
      </Popover>

      <audio ref={audioRef} src={src} preload="metadata" />
    </Group>
  );
}
