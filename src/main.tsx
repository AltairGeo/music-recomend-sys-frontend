import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import { Routes } from "react-router";
import { Route } from "react-router";
import { MainInfo } from "./components/MainPageInfo.tsx";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
