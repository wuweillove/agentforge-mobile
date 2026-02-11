import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  ScrollView,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import AgentNode from './AgentNode';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CANVAS_SIZE = 3000;

const WorkflowCanvas = ({ workflow, onWorkflowChange }) => {
  const [scale, setScale] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const scrollViewRef = useRef(null);

  const handleNodeMove = (nodeId, position) => {
    const updatedNodes = workflow.nodes.map((node) =>
      node.id === nodeId ? { ...node, position } : node
    );
    onWorkflowChange({ ...workflow, nodes: updatedNodes });
  };

  const handleNodeDelete = (nodeId) => {
    const updatedNodes = workflow.nodes.filter((node) => node.id !== nodeId);
    const updatedConnections = workflow.connections.filter(
      (conn) => conn.from !== nodeId && conn.to !== nodeId
    );
    onWorkflowChange({
      ...workflow,
      nodes: updatedNodes,
      connections: updatedConnections,
    });
  };

  const handleNodeConnect = (fromId, toId) => {
    // Check if connection already exists
    const exists = workflow.connections.some(
      (conn) => conn.from === fromId && conn.to === toId
    );
    if (!exists) {
      const newConnection = { from: fromId, to: toId };
      onWorkflowChange({
        ...workflow,
        connections: [...workflow.connections, newConnection],
      });
    }
  };

  const renderConnections = () => {
    return workflow.connections.map((conn, index) => {
      const fromNode = workflow.nodes.find((n) => n.id === conn.from);
      const toNode = workflow.nodes.find((n) => n.id === conn.to);

      if (!fromNode || !toNode) return null;

      const x1 = (fromNode.position?.x || 0) + 50;
      const y1 = (fromNode.position?.y || 0) + 40;
      const x2 = (toNode.position?.x || 0) + 50;
      const y2 = (toNode.position?.y || 0) + 40;

      return (
        <Line
          key={`connection-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#6C5CE7"
          strokeWidth={2}
        />
      );
    });
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.5));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.canvas,
              {
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                transform: [{ scale }],
              },
            ]}
          >
            <Svg style={StyleSheet.absoluteFill}>{renderConnections()}</Svg>

            {workflow.nodes.map((node) => (
              <AgentNode
                key={node.id}
                node={node}
                selected={selectedNode === node.id}
                onMove={handleNodeMove}
                onDelete={handleNodeDelete}
                onSelect={setSelectedNode}
              />
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Zoom Controls */}
      <View style={styles.controls}>
        <IconButton
          icon="plus"
          size={24}
          iconColor="#fff"
          style={styles.controlButton}
          onPress={handleZoomIn}
        />
        <IconButton
          icon="minus"
          size={24}
          iconColor="#fff"
          style={styles.controlButton}
          onPress={handleZoomOut}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollView: {
    flex: 1,
  },
  canvas: {
    backgroundColor: '#0f0f1e',
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#16213e',
    borderRadius: 8,
    overflow: 'hidden',
  },
  controlButton: {
    margin: 0,
    backgroundColor: '#16213e',
  },
});

export default WorkflowCanvas;
