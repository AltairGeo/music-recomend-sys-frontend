import {
  Anchor,
  Card,
  Container,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { TrackAPI } from "../features/Track/api";
import { useEffect, useState } from "react";
import type { TrackModel } from "../features/Track/model";
import { RandomTrackWidget } from "./RandomTrack";

export function MainInfo() {
  const [track, setTrack] = useState<TrackModel | null>(null);
  const [, setLoading] = useState(true);

  const track_api: TrackAPI = new TrackAPI();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await track_api.getRandomTrack(1);
        setTrack(res.tracks?.[0] ?? null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <Container size="md" py="xl">
        <Stack align="center" gap="md">
          <Title order={1} ta="center">
            Проект музыкальной рекомендательной системы
          </Title>
          <br></br>
        </Stack>
        <Card withBorder radius="md" p="lg">
          <Stack gap="sm">
            <Title order={2}>Что это?</Title>
            <Text size="md">
              Это веб-интерфейс, созданный для демонстрации работы
              рекомендательной системы, разработанной в рамках школьного
              проекта. Проект создан в учебных целях и демонстрирует базовые
              принципы рекомендательных систем. Ссылку на электронную версию
              проекта вы можете найти ниже, в разделе{" "}
              <Anchor href="#usefull_links">«Полезные ссылки»</Anchor>. Там же,
              вы сможете найти ссылку на использованный датасет музыки (FMA
              dataset).
            </Text>
          </Stack>
        </Card>
        <br />
        <Card withBorder radius="md" p="lg">
          <Stack gap="sm">
            <Title order={2}>Вы можете:</Title>

            <List spacing="xs">
              <List.Item>Поиск по нашей базе треков</List.Item>
              <List.Item>Получать список схожих аудиозаписей</List.Item>
              <List.Item>Cлушать превью треков</List.Item>
              <List.Item>
                Просматривать метаданные (жанр, год, альбом)
              </List.Item>
              <List.Item>
                Загружать свою музыку и получать похожие треки из нашей базы.
              </List.Item>
            </List>
          </Stack>
        </Card>
        <br />

        {track && (
          <>
            <RandomTrackWidget />
            <br />
          </>
        )}

        <Card withBorder radius="md" p="lg">
          <Stack gap="sm">
            <Title order={2} id="usefull_links">
              Полезные ссылки
            </Title>
            <Stack gap="xs">
              <Anchor href="https://docs.google.com/document/d/1cXo_UPJbJl9MKWxnhDza8XK090jCwQZ2Z3vywPJzWGU/edit?usp=sharing">
                Проект (Google Docs)
              </Anchor>

              <Anchor>Проект (PDF)</Anchor>

              <Anchor href="https://arxiv.org/abs/1612.01840">
                FMA датасет
              </Anchor>

              <Anchor href="https://github.com/AltairGeo/music-recomend-sys">
                Github проекта(Бэкенд часть)
              </Anchor>

              <Anchor href="https://github.com/AltairGeo/music-recomend-sys-frontend">
                Github проекта(Фронтенд часть)
              </Anchor>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
