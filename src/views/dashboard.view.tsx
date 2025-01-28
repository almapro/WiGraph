import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type OnConnect,
    BackgroundVariant,
    ColorMode,
} from '@xyflow/react';
import { Driver } from 'neo4j-driver';
import { useCallback } from 'react';
import { initialNodes, nodeTypes } from '../nodes';
import { initialEdges, edgeTypes } from '../edges';
import { FloatingActionsComponent } from '../components';
import { useTitle } from 'react-use';

export const DashboardView: React.FC<{ driver: Driver, colorMode: ColorMode, setColorMode: React.Dispatch<React.SetStateAction<ColorMode>> }> = ({ driver, colorMode, setColorMode }) => {
    useTitle('WiGraph - Dashboard');
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );
    return (
        <ReactFlow
                            colorMode= { colorMode }
    nodes = { nodes }
    nodeTypes = { nodeTypes }
    onNodesChange = { onNodesChange }
    edges = { edges }
    edgeTypes = { edgeTypes }
    onEdgesChange = { onEdgesChange }
    onConnect = { onConnect }
    fitView
        >
        <Background variant={ BackgroundVariant.Dots } />
            < MiniMap />
            <Controls />
            < FloatingActionsComponent colorMode = { colorMode } setColorMode = { setColorMode } />
                </ReactFlow>
	)
}
