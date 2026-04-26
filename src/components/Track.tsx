import { useEffect, useMemo, useRef, useState } from "react";
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
import { SpeakerHighIcon } from "@phosphor-icons/react/dist/ssr";

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
  console.log("TrackCard render", track.id);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekingRef = useRef(false);

  const audioSrc = useMemo(
    () => `${config.api.baseUrl}${track.audio_url}`,
    [track.audio_url],
  );

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(30);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [draftCurrent, setDraftCurrent] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    console.log("TrackCard mounted", track.id);
    return () => console.log("TrackCard unmounted", track.id);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const onTime = () => {
      if (!seekingRef.current && !audio.seeking) {
        console.log("timeupdate", audio.currentTime);
        setCurrent(audio.currentTime);
      }
    };

    const onSeeking = () => {
      seekingRef.current = true;
    };

    const onSeeked = () => {
      seekingRef.current = false;
      setCurrent(audio.currentTime);
      setDraftCurrent(null);
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    const onEnd = () => {
      seekingRef.current = false;
      setPlaying(false);
      setCurrent(0);
      setDraftCurrent(null);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("seeking", onSeeking);
    audio.addEventListener("seeked", onSeeked);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("seeking", onSeeking);
      audio.removeEventListener("seeked", onSeeked);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        audio.volume = volume / 100;
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (e) {
      console.error("Audio play error:", e);
    }
  };

  const handleSeek = (value: number) => {
    seekingRef.current = true;
    setDraftCurrent(value);
  };

  const handleSeekEnd = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("SEEK start", value, "before:", audio.currentTime);

    const doSeek = () => {
      audio.currentTime = value;

      console.log("SEEK applied", {
        wanted: value,
        actual: audio.currentTime,
      });

      setCurrent(value);
      setDraftCurrent(null);
    };

    if (audio.readyState >= 1) {
      doSeek();
    } else {
      audio.addEventListener("loadedmetadata", doSeek, { once: true });
    }
  };

  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const displayCurrent = draftCurrent ?? current;

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      shadow="sm"
      style={{
        background: "linear-gradient(145deg, #1b1b1b, #141414)",
        borderColor: "#2a2a2a",
      }}
    >
      <Group align="flex-start" justify="space-between">
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

          <Group align="center" gap="sm" mt="md">
            <Button size="xs" onClick={togglePlay}>
              {playing ? "Pause" : "Play"}
            </Button>

            <Stack gap={2} style={{ flex: 1 }}>
              <Slider
                value={displayCurrent}
                onChange={handleSeek}
                onChangeEnd={handleSeekEnd}
                min={0}
                max={duration || 1}
                step={0.1}
                label={(v) => formatTime(v)}
              />

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {formatTime(displayCurrent)}
                </Text>

                <Text size="xs" c="dimmed">
                  {formatTime(duration)}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Stack>

        <Stack align="center" gap={4}>
          <SpeakerHighIcon size={20} weight="bold" />

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

      <audio ref={audioRef} key={track.id} src={audioSrc} preload="metadata" />
    </Card>
  );
}
