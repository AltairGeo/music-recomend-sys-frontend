import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
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

        <AppShell.Navbar p="md">Sidebar</AppShell.Navbar>

        <AppShell.Main></AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
