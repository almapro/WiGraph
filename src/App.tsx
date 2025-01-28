import { useEffect, useState } from "react";
import { ColorMode } from "@xyflow/react";
import { useLocalStorage } from "react-use";

import "@xyflow/react/dist/style.css";

import { RestrictedRoute } from "./components";
import { Flowbite, useThemeMode } from "flowbite-react";
import { Route, Routes } from "react-router";
import { ConnectView } from "./views";
import { Driver } from "neo4j-driver";
import { SnackbarProvider } from "notistack";
import { AppContext } from "./app.context";

export default function App() {
  const [storedColorMode, setStoredColorMode] = useLocalStorage(
    "colorMode",
    "system",
  );
  const { setMode } = useThemeMode();
  useEffect(() => {
    setMode(storedColorMode === "dark" ? "light" : "dark");
  }, [setMode, storedColorMode]);
  const [colorMode, setColorMode] = useState<ColorMode>(
    storedColorMode as ColorMode,
  );
  useEffect(() => {
    setStoredColorMode(colorMode);
    setMode(colorMode === "dark" ? "dark" : "light");
  }, [colorMode, setStoredColorMode, setMode]);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [autoConnect, setAutoConnect] = useState(true);
  const [showAddNode, setShowAddNode] = useState(false);
  return (
    <AppContext.Provider
      value={{
        driver,
        setDriver,
        colorMode,
        setColorMode,
        autoConnect,
        setAutoConnect,
        showAddNode,
        setShowAddNode,
      }}
    >
      <Flowbite
        theme={{
          theme: {
            tooltip: {
              arrow: {
                style: {
                  dark: "bg-gray-900 dark:bg-zinc-700",
                  light: "bg-white",
                  auto: "bg-white dark:bg-zinc-700",
                },
              },
              style: {
                dark: "bg-gray-900 text-white dark:bg-zinc-700",
                auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-zinc-700 dark:text-white",
              },
            },
            textInput: {
              field: {
                input: {
                  colors: {
                    gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
                  },
                },
              },
            },
          },
        }}
      >
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Routes>
            <Route path="/" element={<RestrictedRoute />} />
            <Route path="/connect" element={<ConnectView />} />
          </Routes>
        </SnackbarProvider>
      </Flowbite>
    </AppContext.Provider>
  );
}
