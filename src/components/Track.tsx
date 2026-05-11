import { Badge, Card, Group, Stack, Text, Anchor } from "@mantine/core";

import { Link } from "react-router";

import { config } from "../config";

import { AudioPlayer } from "../pages/Track/audioPlayer";

export interface TrackCardModel {
  id: number;
  title: string;
  artist: string;
  genre?: string;
  audio_url: string;
}

interface Props {
  track: TrackCardModel;
}

export function TrackCard({ track }: Props) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Stack gap="md">
        <Stack gap={2}>
          <Anchor
            component={Link}
            to={`/tracks/${track.id}`}
            fw={700}
            size="lg"
            underline="never"
          >
            {track.title}
          </Anchor>

          <Group gap="xs">
            <Text c="dimmed" size="sm">
              {track.artist}
            </Text>

            {track.genre && (
              <Badge variant="light" size="sm">
                {track.genre}
              </Badge>
            )}
          </Group>
        </Stack>

        <AudioPlayer src={`${config.api.baseUrl}${track.audio_url}`} />
      </Stack>
    </Card>
  );
}
