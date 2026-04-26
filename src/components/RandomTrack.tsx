import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Stack,
  Group,
  Text,
  Button,
  Loader,
  ThemeIcon,
} from "@mantine/core";

import { TrackCard } from "./Track";
import { TrackAPI } from "../features/Track/api";
import type { TrackCardModel } from "./Track";
import {
  ArrowsClockwiseIcon,
  MusicNotesIcon,
} from "@phosphor-icons/react/dist/ssr";

export function RandomTrackWidget() {
  const [track, setTrack] = useState<TrackCardModel | null>(null);
  const [loading, setLoading] = useState(false);

  const api = useMemo(() => new TrackAPI(), []);

  const fetchTrack = async () => {
    setLoading(true);
    try {
      const res = await api.getRandomTrack(1);
      setTrack(res.tracks?.[0] ?? null);
    } catch (e) {
      console.error("Failed to load track:", e);
      setTrack(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
  }, []);

  return (
    <Card withBorder radius="lg" p="lg" shadow="sm">
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="sm">
            <ThemeIcon variant="light" size="md">
              <MusicNotesIcon size={16} weight="bold" />
            </ThemeIcon>

            <Text fw={700} size="lg">
              Случайный трек
            </Text>
          </Group>

          <Button
            size="xs"
            variant="light"
            leftSection={<ArrowsClockwiseIcon size={16} weight="bold" />}
            onClick={fetchTrack}
            disabled={loading}
          >
            Новый
          </Button>
        </Group>

        {loading && (
          <Group justify="center" py="xl">
            <Loader size="sm" />
          </Group>
        )}

        {!loading && track && <TrackCard key={track.id} track={track} />}

        {!loading && !track && (
          <Text size="sm" c="dimmed" ta="center">
            Нет доступных треков
          </Text>
        )}
      </Stack>
    </Card>
  );
}
