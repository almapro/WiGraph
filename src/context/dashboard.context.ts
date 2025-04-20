import { Driver } from "neo4j-driver";
import { createContext, useContext } from "react";
import { AppNode, NodeType } from "../nodes/types";
import { Connection, Edge } from "@xyflow/react";

export type DashboardContextProps = {
    driver: Driver;
    contextMenu: {
        x: number;
        y: number;
        node: AppNode;
    } | null;
    setContextMenu: (contextMenu: {
        x: number;
        y: number;
        node: AppNode;
    } | null) => void;
    showConvertingToWifi: boolean;
    setShowConvertingToWifi: (showConvertingToWifi: boolean) => void;
    showAddingClientsToWifi: boolean;
    setShowAddingClientsToWifi: (showAddingClientsToWifi: boolean) => void;
    showEditingNode: boolean;
    setShowEditingNode: (showEditingNode: boolean) => void;
    showDeleteNode: boolean;
    setShowDeleteNode: (showDeleteNode: boolean) => void;
    activeNode: AppNode | null;
    setActiveNode: (activeNode: AppNode | null) => void;
    showAddNode: boolean
    setShowAddNode: (showAddNode: boolean) => void
    showAddType: NodeType
    setShowAddType: (showAddType: NodeType) => void
    showDeleteRelation: boolean;
    setShowDeleteRelation: (showDeleteRelation: boolean) => void;
    relationToDelete: Edge | null;
    setRelationToDelete: (relationToDelete: Edge | null) => void;
    showAddRelation: boolean;
    setShowAddRelation: (showAddRelation: boolean) => void;
    relationToAdd: Connection | null;
    setRelationToAdd: (relationToAdd: Connection | null) => void;
    hoveringNode: AppNode | null;
    setHoveringNode: (hoveringNode: AppNode | null) => void;
    reconnecting: boolean;
    setReconnecting: (reconnecting: boolean) => void;
};

export const DashboardContext = createContext<DashboardContextProps>({
    driver: {} as Driver,
    contextMenu: null,
    setContextMenu: () => {},
    showConvertingToWifi: false,
    setShowConvertingToWifi: () => {},
    showAddingClientsToWifi: false,
    setShowAddingClientsToWifi: () => {},
    showEditingNode: false,
    setShowEditingNode: () => {},
    showDeleteNode: false,
    setShowDeleteNode: () => {},
    activeNode: null,
    setActiveNode: () => {},
    showAddNode: false,
    setShowAddNode: () => { },
    showAddType: "WIFI",
    setShowAddType: () => { },
    showDeleteRelation: false,
    setShowDeleteRelation: () => {},
    relationToDelete: null,
    setRelationToDelete: () => {},
    showAddRelation: false,
    setShowAddRelation: () => {},
    relationToAdd: null,
    setRelationToAdd: () => {},
    hoveringNode: null,
    setHoveringNode: () => {},
    reconnecting: false,
    setReconnecting: () => {},
});

export const useDashboardContext = () => {
    return useContext(DashboardContext);
};