import "./index.css";
import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Layout from "./components/ui/Layout";
import { SocketRoomProvider } from "./context/SocketRoom";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider emotionOptions={{ key: "mantine", prepend: false }} theme={{ colorScheme: "dark" }} withGlobalStyles withNormalizeCSS>
      <SocketRoomProvider>
        <Layout>
          <App />
        </Layout>
      </SocketRoomProvider>
    </MantineProvider>
  </React.StrictMode>
);
