import { useState } from "react";
import {
  Container,
  Title,
  Stack,
  Paper,
  Text,
  Button,
  Group,
  SimpleGrid,
  Loader,
  Center,
} from "@mantine/core";

import { FileInput } from "@mantine/core";

import { track_api } from "../../features/Track/api";
import type { SimilarTrack } from "../../features/Track/model";
import { TrackCard } from "../../components/Track";

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [similar, setSimilar] = useState<SimilarTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const res = await track_api.uploadTrack(file);
      setSimilar(res.tracks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Title order={1}>Загрузка собственного аудио</Title>

        <Paper withBorder p="xl" radius="md">
          <Stack gap="md">
            <Text c="dimmed">
              Загрузите свой аудиофайл и получите похожие треки из нашей
              коллекции.
            </Text>

            <FileInput
              placeholder="Select MP3 file"
              value={file}
              onChange={setFile}
              accept=".mp3,audio/mpeg"
            />

            <Group>
              <Button onClick={upload} disabled={!file} loading={loading}>
                Найти похожие
              </Button>
            </Group>

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}
          </Stack>
        </Paper>

        {loading && (
          <Center>
            <Loader />
          </Center>
        )}

        {!loading && similar.length > 0 && (
          <Stack gap="sm">
            <Title order={2}>Похожие треки</Title>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} spacing="md">
              {similar.map(({ track }) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
