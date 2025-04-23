import { useState } from "react";
import { FC } from "react";
import { DashboardContext } from "../context";
import { AppNode, NodeType } from "../nodes";
import { Connection, Edge } from "@xyflow/react";
import { Driver } from "neo4j-driver";

export const DashboardProvider: FC<{ children: React.ReactNode, driver: Driver }> = ({ children, driver }) => {
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        node: AppNode;
    } | null>(null);
    const [showConvertingToWifi, setShowConvertingToWifi] = useState(false);
    const [showAddingClientsToWifi, setShowAddingClientsToWifi] = useState(false);
    const [showEditingNode, setShowEditingNode] = useState(false);
    const [showDeleteNode, setShowDeleteNode] = useState(false);
    const [activeNode, setActiveNode] = useState<AppNode | null>(null);
    const [showAddNode, setShowAddNode] = useState(false);
    const [showAddType, setShowAddType] = useState<NodeType>("WIFI");
    const [showDeleteRelation, setShowDeleteRelation] = useState(false);
    const [relationToDelete, setRelationToDelete] = useState<Edge | null>(null);
    const [showAddRelation, setShowAddRelation] = useState(false);
    const [relationToAdd, setRelationToAdd] = useState<Connection | null>(null);
    const [hoveringNode, setHoveringNode] = useState<AppNode | null>(null);
    const [reconnecting, setReconnecting] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragIntersectingNodes, setDragIntersectingNodes] = useState<AppNode[]>([]);
    const [showImportFromFile, setShowImportFromFile] = useState(false);
    return (
        <DashboardContext.Provider value={{
            driver,
            contextMenu,
            setContextMenu,
            showConvertingToWifi,
            setShowConvertingToWifi,
            showAddingClientsToWifi,
            setShowAddingClientsToWifi,
            showEditingNode,
            setShowEditingNode,
            showDeleteNode,
            setShowDeleteNode,
            activeNode,
            setActiveNode,
            showAddNode,
            setShowAddNode,
            showAddType,
            setShowAddType,
            showDeleteRelation,
            setShowDeleteRelation,
            relationToDelete,
            setRelationToDelete,
            showAddRelation,
            setShowAddRelation,
            relationToAdd,
            setRelationToAdd,
            hoveringNode,
            setHoveringNode,
            reconnecting,
            setReconnecting,
            dragging,
            setDragging,
            dragIntersectingNodes,
            setDragIntersectingNodes,
            showImportFromFile,
            setShowImportFromFile,
        }}>{children}</DashboardContext.Provider>
    );
};
