import { Driver } from "neo4j-driver";
import { createContext } from "react";
import { AppNode, NodeType } from "../nodes/types";
import { Connection, Edge } from "@xyflow/react";

export type DashboardContextProps = {
    driver: Driver;
    contextMenu: {
        x: number;
        y: number;
        node: AppNode;
    } | null;
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
    selectedEdge: Edge | null;
    setSelectedEdge: (selectedEdge: Edge | null) => void;
    showAddRelation: boolean;
    setShowAddRelation: (showAddRelation: boolean) => void;
    relationToAdd: Connection | null;
    setRelationToAdd: (relationToAdd: Connection | null) => void;
};

export const DashboardContext = createContext<DashboardContextProps>({
    driver: {} as Driver,
    contextMenu: null,
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
    selectedEdge: null,
    setSelectedEdge: () => {},
    showAddRelation: false,
    setShowAddRelation: () => {},
    relationToAdd: null,
    setRelationToAdd: () => {},
});