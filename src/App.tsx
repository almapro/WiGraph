import { useCallback, useEffect, useState } from 'react';
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
import { useLocalStorage } from 'react-use';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import { FloatingActionsComponent } from './components';
import { Flowbite, useThemeMode } from 'flowbite-react';

export default function App() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );
    const [storedColorMode, setStoredColorMode] = useLocalStorage('colorMode', 'system');
    const { setMode } = useThemeMode();
    useEffect(() => {
        setMode(storedColorMode === 'dark' ? 'light' : 'dark');
    }, [setMode, storedColorMode]);
    const [colorMode, setColorMode] = useState<ColorMode>(storedColorMode as ColorMode);
    useEffect(() => {
        setStoredColorMode(colorMode);
        setMode(colorMode === 'dark' ? 'dark' : 'light');
    }, [colorMode, setStoredColorMode, setMode]);
    return (
        <ReactFlow
            colorMode={colorMode}
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Flowbite>
                <Background variant={BackgroundVariant.Dots} />
                <MiniMap />
                <Controls />
                <FloatingActionsComponent colorMode={colorMode} setColorMode={setColorMode} />
            </Flowbite>
        </ReactFlow>
    );
}
