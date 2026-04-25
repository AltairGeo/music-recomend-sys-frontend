import { useState } from "react";
import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { TrackCard } from "../components/Track";
import type { TrackModel } from "../features/Track/model";
import { TrackAPI } from "../features/Track/api";
const trackApi = new TrackAPI();

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<TrackModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setTracks([]);
      setError("Введите запрос поиска");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await trackApi.searchTracks(trimmed);
      setTracks(data.tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка поиска");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>Поиск треков</Title>
          <Text c="dimmed">
            Найди треки по названию, исполнителю, жанру или альбому.
          </Text>
        </Stack>

        <Paper withBorder p="md" radius="md" pos="relative">
          <LoadingOverlay visible={loading} />

          <Stack gap="md">
            <Group align="flex-end">
              <TextInput
                label="Поисковый запрос"
                placeholder="Например: Sunny Day"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <Button onClick={handleSearch} loading={loading}>
                Искать
              </Button>
            </Group>

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}
          </Stack>
        </Paper>

        {tracks.length > 0 ? (
          <Stack gap="md">
            <Text fw={600}>Найдено: {tracks.length}</Text>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} spacing="md">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </SimpleGrid>
          </Stack>
        ) : (
          !loading &&
          !error && (
            <Text c="dimmed">
              Пока ничего не найдено. Введи запрос и нажми «Искать».
            </Text>
          )
        )}
      </Stack>
    </Container>
  );
}
