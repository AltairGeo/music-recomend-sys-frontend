import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Badge,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Center,
  Anchor,
} from "@mantine/core";

import { track_api } from "../../features/Track/api";
import type { SimilarTrack, TrackModel } from "../../features/Track/model";

import { TrackCard } from "../../components/Track";
import { AudioPlayer } from "./audioPlayer";
import { config } from "../../config";

function getAudioSrc(url: string) {
  return `${config.api.baseUrl}${url}`;
}

export function TrackPage() {
  const { track_id } = useParams();
  const trackId = Number(track_id);

  const [track, setTrack] = useState<TrackModel | null>(null);
  const [similar, setSimilar] = useState<SimilarTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(trackId)) {
      setError("Invalid track id");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [trackData, similarData] = await Promise.all([
          track_api.getTrack(trackId),
          track_api.getSimilarTracks(trackId, 8),
        ]);

        if (cancelled) return;

        setTrack(trackData);
        setSimilar(similarData.tracks);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load track");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [trackId]);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center mih={300}>
          <Loader />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Paper withBorder p="xl" radius="md">
          <Stack gap="md">
            <Title order={2}>Error</Title>
            <Text c="red">{error}</Text>
            <Anchor component={Link} to="/tracks">
              К трекам
            </Anchor>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!track) {
    return (
      <Container size="lg" py="xl">
        <Text c="dimmed">Track not found</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* TRACK INFO */}
        <Paper withBorder p="xl" radius="md">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Title order={1}>{track.title}</Title>
                <Text c="dimmed">{track.artist}</Text>
              </Stack>

              <Badge variant="light">#{track.id}</Badge>
            </Group>

            {/* metadata */}
            <Group gap="xs">
              {track.genre?.trim() && (
                <Badge variant="outline">{track.genre}</Badge>
              )}

              {track.year && <Badge variant="outline">{track.year}</Badge>}

              {track.album?.trim() && (
                <Badge variant="outline">{track.album}</Badge>
              )}
            </Group>

            <Divider />

            {track.additional_info?.trim() && (
              <Text size="sm">{track.additional_info}</Text>
            )}

            <Text size="sm" c="dimmed">
              License: {track.license}
            </Text>

            {/* AUDIO */}
            <AudioPlayer src={getAudioSrc(track.audio_url)} />
          </Stack>
        </Paper>

        {/* SIMILAR TRACKS */}
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={2}>Похожие треки</Title>
            <Text c="dimmed" size="sm">
              Найдено треков - {similar.length}
            </Text>
          </Group>

          {similar.length === 0 ? (
            <Text c="dimmed">Похожих треков не найдено</Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing="md">
              {similar.map(({ track }) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
