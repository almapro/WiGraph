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
} from '@xyflow/react';
import { Driver } from 'neo4j-driver';
import { useCallback, useContext } from 'react';
import { initialNodes, nodeTypes } from '../nodes';
import { initialEdges, edgeTypes } from '../edges';
import { FloatingActionsComponent } from '../components';
import { useTitle } from 'react-use';
import { AppContext } from '../app.context';

export const DashboardView: React.FC<{ driver: Driver }> = ({ driver }) => {
	useTitle('WiGraph - Dashboard');
	const { colorMode } = useContext(AppContext);
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
			< FloatingActionsComponent />
			</ReactFlow>
	)
}
