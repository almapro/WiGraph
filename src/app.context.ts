import { ColorMode } from "@xyflow/react";
import { Driver } from "neo4j-driver";
import { createContext } from "react";

export type AppContextProps = {
    driver: Driver | null
    setDriver: (driver: Driver | null) => void
    colorMode: ColorMode
    setColorMode: (colorMode: ColorMode) => void
    autoConnect: boolean
    setAutoConnect: (autoConnect: boolean) => void
    showAddNode: boolean
    setShowAddNode: (showAddNode: boolean) => void
}

export const AppContext = createContext<AppContextProps>({
    driver: null,
    setDriver: () => { },
    colorMode: 'system',
    setColorMode: () => { },
    autoConnect: true,
    setAutoConnect: () => { },
    showAddNode: false,
    setShowAddNode: () => { }
})

