import { AppShell, Burger, Group, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  HouseLineIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  UploadIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "react-router";
function App({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
            <Text fw={700}>MusProject</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavLink
            component={Link}
            to="/"
            label="Главная"
            leftSection={<HouseLineIcon size={20} weight="bold" />}
          />
          <NavLink
            component={Link}
            to="/search"
            label="Поиск"
            leftSection={<MagnifyingGlassIcon size={20} weight="bold" />}
          />

          <NavLink
            component={Link}
            to="/tracks"
            label="Треки"
            leftSection={<ListBulletsIcon size={20} weight="bold" />}
          />

          <NavLink
            component={Link}
            to="/upload"
            label="Загрузить"
            leftSection={<UploadIcon size={20} weight="bold" />}
          />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
