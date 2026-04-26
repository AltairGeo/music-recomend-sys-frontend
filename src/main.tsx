import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import { Routes } from "react-router";
import { Route } from "react-router";
import { MainInfo } from "./components/MainPageInfo.tsx";
import { SearchPage } from "./pages/Search.tsx";
import { TracksPage } from "./pages/TracksList/tracks.tsx";
import { TrackPage } from "./pages/Track/track.tsx";
import { UploadPage } from "./pages/Upload/upload.tsx";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App>
              <MainInfo />
            </App>
          }
        />
        <Route
          path="/search"
          element={
            <App>
              <SearchPage />
            </App>
          }
        />
        <Route
          path="/tracks"
          element={
            <App>
              <TracksPage />
            </App>
          }
        />
        <Route
          path="/tracks/:track_id"
          element={
            <App>
              <TrackPage />
            </App>
          }
        />
        <Route
          path="/upload"
          element={
            <App>
              <UploadPage />
            </App>
          }
        />
      </Routes>
    </BrowserRouter>
  </MantineProvider>,
);
