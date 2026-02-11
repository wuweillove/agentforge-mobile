import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  ScrollView,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import AgentNode from './AgentNode';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const WorkflowCanvas = ({ workflow, onWorkflowChange }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);

  const handleNodePress = (node) => {
    setSelectedNode(node.id);
  };

  const handleNodeMove = (nodeId, newPosition) => {
    const updatedNodes = workflow.nodes.map(node =>
      node.id === nodeId ? { ...node, position: newPosition } : node
    );
    onWorkflowChange({ ...workflow, nodes: updatedNodes });
  };

  const handleNodeDelete = (nodeId) => {
    const updatedNodes = workflow.nodes.filter(node => node.id !== nodeId);
    const updatedConnections = workflow.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );
    onWorkflowChange({
      ...workflow,
      nodes: updatedNodes,
      connections: updatedConnections,
    });
    setSelectedNode(null);
  };

  const handleStartConnection = (nodeId) => {
    setConnectingFrom(nodeId);
  };

  const handleCompleteConnection = (toNodeId) => {
    if (connectingFrom && connectingFrom !== toNodeId) {
      const newConnection = {
        id: `conn_${Date.now()}`,
        from: connectingFrom,
        to: toNodeId,
      };
      onWorkflowChange({
        ...workflow,
        connections: [...workflow.connections, newConnection],
      });
    }
    setConnectingFrom(null);
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.2, 0.5));
  };

  const handleResetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const getNodePosition = (nodeId) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    return node ? node.position : { x: 0, y: 0 };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.canvas}
        contentContainerStyle={{
          width: width * 2,
          height: height * 2,
        }}
        scrollEnabled={true}
      >
        <View style={[styles.canvasContent, { transform: [{ scale }] }]}>
          {/* Draw Connections */}
          <Svg style={StyleSheet.absoluteFill}>
            {workflow.connections.map((conn) => {
              const fromPos = getNodePosition(conn.from);
              const toPos = getNodePosition(conn.to);
              return (
                <Line
                  key={conn.id}
                  x1={fromPos.x + 60}
                  y1={fromPos.y + 40}
                  x2={toPos.x + 60}
                  y2={toPos.y + 40}
                  stroke="#6C5CE7"
                  strokeWidth="2"
                  strokeDasharray={connectingFrom ? "5,5" : "0"}
                />
              );
            })}
          </Svg>

          {/* Render Nodes */}
          {workflow.nodes.map((node) => (
            <AgentNode
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onPress={() => handleNodePress(node)}
              onMove={(newPosition) => handleNodeMove(node.id, newPosition)}
              onDelete={() => handleNodeDelete(node.id)}
              onStartConnection={() => handleStartConnection(node.id)}
              onCompleteConnection={() => handleCompleteConnection(node.id)}
              isConnecting={connectingFrom === node.id}
            />
          ))}
        </View>
      </ScrollView>

      {/* Zoom Controls */}
      <View style={styles.controls}>
        <IconButton
          icon="plus"
          size={20}
          iconColor="#fff"
          style={styles.controlButton}
          onPress={handleZoomIn}
        />
        <IconButton
          icon="minus"
          size={20}
          iconColor="#fff"
          style={styles.controlButton}
          onPress={handleZoomOut}
        />
        <IconButton
          icon="restore"
          size={20}
          iconColor="#fff"
          style={styles.controlButton}
          onPress={handleResetView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  canvas: {
    flex: 1,
  },
  canvasContent: {
    flex: 1,
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 5,
  },
  controlButton: {
    backgroundColor: '#0f3460',
    margin: 2,
  },
});

export default WorkflowCanvas;