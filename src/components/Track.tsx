import { useRef, useState, useEffect } from "react";
import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Badge,
  Slider,
  Anchor,
} from "@mantine/core";
import { config } from "../config";
import { Link } from "react-router";
import { IconVolume } from "@tabler/icons-react";

export interface TrackCardModel {
  id: number;
  title: string;
  artist: string;
  genre?: string;
  audio_url: string;
}

interface TrackProps {
  track: TrackCardModel;
}

export function TrackCard({ track }: TrackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);

  const [volume, setVolume] = useState(10);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // audio listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrent(audio.currentTime);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!playing) {
        audio.volume = volume / 100;
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (e) {
      console.error("Audio play error:", e);
    }
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrent(value);
  };

  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Card withBorder radius="md" p="md" shadow="sm">
      <Group align="flex-start" justify="space-between">
        {/* Info */}
        <Stack gap={4} style={{ flex: 1 }}>
          <Text fw={600} lineClamp={1}>
            <Anchor component={Link} to={`/tracks/${track.id}`}>
              {track.title}
            </Anchor>
          </Text>

          <Group>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {track.artist}
            </Text>

            {track.genre && (
              <Badge variant="light" size="xs">
                {track.genre}
              </Badge>
            )}
          </Group>

          {/* Progress + Play */}
          <Group align="center" gap="sm" mt="md">
            <Button size="xs" onClick={togglePlay}>
              {playing ? "Pause" : "Play"}
            </Button>

            <Stack gap={2} style={{ flex: 1 }}>
              <Slider
                value={current}
                onChange={handleSeek}
                min={0}
                max={duration || 0}
                step={0.1}
                label={(v) => formatTime(v)}
              />

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {formatTime(current)}
                </Text>

                <Text size="xs" c="dimmed">
                  {formatTime(duration)}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Stack>

        {/* Volume */}
        <Stack align="center" gap={4}>
          <IconVolume size={20} />

          <Slider
            orientation="vertical"
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            step={1}
            h={80}
            label={null}
          />
        </Stack>
      </Group>

      <audio ref={audioRef} src={`${config.api.baseUrl}${track.audio_url}`} />
    </Card>
  );
}
