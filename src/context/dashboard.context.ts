import { Driver } from "neo4j-driver";
import { createContext } from "react";
import { AppNode } from "../nodes/types";
import { Edge } from "@xyflow/react";

export type DashboardContextProps = {
    driver: Driver;
    contextMenu: {
        x: number;
        y: number;
        node: AppNode;
    } | null;
    showConvertingToWifi: boolean;
    setShowConvertingToWifi: (showConvertingToWifi: boolean) => void;
    showAddingClients: boolean;
    setShowAddingClients: (showAddingClients: boolean) => void;
    showEditingNode: boolean;
    setShowEditingNode: (showEditingNode: boolean) => void;
    showDeleteNode: boolean;
    setShowDeleteNode: (showDeleteNode: boolean) => void;
    activeNode: AppNode | null;
    setActiveNode: (activeNode: AppNode | null) => void;
    showAddNode: boolean
    setShowAddNode: (showAddNode: boolean) => void
    showDeleteRelation: boolean;
    setShowDeleteRelation: (showDeleteRelation: boolean) => void;
    relationToDelete: Edge | null;
    setRelationToDelete: (relationToDelete: Edge | null) => void;
    selectedEdge: Edge | null;
    setSelectedEdge: (selectedEdge: Edge | null) => void;
};

export const DashboardContext = createContext<DashboardContextProps>({
    driver: {} as Driver,
    contextMenu: null,
    showConvertingToWifi: false,
    setShowConvertingToWifi: () => {},
    showAddingClients: false,
    setShowAddingClients: () => {},
    showEditingNode: false,
    setShowEditingNode: () => {},
    showDeleteNode: false,
    setShowDeleteNode: () => {},
    activeNode: null,
    setActiveNode: () => {},
    showAddNode: false,
    setShowAddNode: () => { },
    showDeleteRelation: false,
    setShowDeleteRelation: () => {},
    relationToDelete: null,
    setRelationToDelete: () => {},
    selectedEdge: null,
    setSelectedEdge: () => {},
});