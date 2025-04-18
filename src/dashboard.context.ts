import { Driver } from "neo4j-driver";
import { createContext } from "react";
import { AppNode } from "./nodes/types";

export type DashboardContextProps = {
    driver: Driver;
    contextMenu: {
        x: number;
        y: number;
        node: AppNode;
    } | null;
    isConvertingToWifi: boolean;
    setIsConvertingToWifi: (isConvertingToWifi: boolean) => void;
    isAddingClients: boolean;
    setIsAddingClients: (isAddingClients: boolean) => void;
    isEditingNode: boolean;
    setIsEditingNode: (isEditingNode: boolean) => void;
    isDeletingNode: boolean;
    setIsDeletingNode: (isDeletingNode: boolean) => void;
    activeNode: AppNode | null;
    setActiveNode: (activeNode: AppNode | null) => void;
};

export const DashboardContext = createContext<DashboardContextProps>({
    driver: {} as Driver,
    contextMenu: null,
    isConvertingToWifi: false,
    setIsConvertingToWifi: () => {},
    isAddingClients: false,
    setIsAddingClients: () => {},
    isEditingNode: false,
    setIsEditingNode: () => {},
    isDeletingNode: false,
    setIsDeletingNode: () => {},
    activeNode: null,
    setActiveNode: () => {},
});