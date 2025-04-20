import { FC, useEffect, useState } from "react";
import { AppContext } from "../context";
import { Driver } from "neo4j-driver";
import { ColorMode } from "@xyflow/react";
import { useLocalStorage } from "react-use";
import { useThemeMode } from "flowbite-react";

export const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [autoConnect, setAutoConnect] = useState(true);
    
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
    return <AppContext.Provider value={{
        driver,
        setDriver,
        autoConnect,
        setAutoConnect,
        colorMode,
        setColorMode,
    }}>{children}</AppContext.Provider>;
};
