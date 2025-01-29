import { useEffect, useState } from "react";
import { ColorMode, ReactFlowProvider } from "@xyflow/react";
import { useLocalStorage } from "react-use";

import "@xyflow/react/dist/style.css";

import { RestrictedRoute } from "./components";
import { Flowbite, useThemeMode } from "flowbite-react";
import { Route, Routes } from "react-router";
import { ConnectView } from "./views";
import { Driver } from "neo4j-driver";
import { SnackbarProvider } from "notistack";
import { AppContext } from "./app.context";
import { theme } from "./flowbite.theme";

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
      <Flowbite theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <ReactFlowProvider>
            <Routes>
              <Route path="/" element={<RestrictedRoute />} />
              <Route path="/connect" element={<ConnectView />} />
            </Routes>
          </ReactFlowProvider>
        </SnackbarProvider>
      </Flowbite>
    </AppContext.Provider>
  );
}
