import { useEffect, useState } from "react";
import {
  Container,
  Title,
  SimpleGrid,
  Pagination,
  Loader,
  Center,
  Text,
  Stack,
} from "@mantine/core";

import type { ListTracksPaginationResponseAPI } from "../../features/Track/model";
import { getTracksPaginated } from "./api";
import { TrackCard } from "../../components/Track";

const LIMIT = 20;

export function TracksPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListTracksPaginationResponseAPI | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const skip = (page - 1) * LIMIT;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const res = await getTracksPaginated(skip, LIMIT);

        if (!cancelled) {
          setData(res);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [skip]);

  const totalPages = data ? Math.ceil(data.count / LIMIT) : 1;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1}>Все треки - {data?.count}</Title>

        {/* Loading */}
        {loading && !data && (
          <Center>
            <Loader />
          </Center>
        )}

        {/* Grid */}
        {!loading && data && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} spacing="md">
            {data.items.map((t) => (
              <TrackCard key={t.id} track={t} />
            ))}
          </SimpleGrid>
        )}

        {/* Empty state */}
        {!loading && data && data.items.length === 0 && (
          <Text c="dimmed" ta="center">
            Нет треков
          </Text>
        )}

        {/* Pagination */}
        <Center>
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            withEdges
          />
        </Center>
      </Stack>
    </Container>
  );
}
