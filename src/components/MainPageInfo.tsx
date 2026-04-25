import {
  Anchor,
  Card,
  Container,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export function MainInfo() {
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

              <Anchor>Github проекта(Фронтенд часть)</Anchor>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
