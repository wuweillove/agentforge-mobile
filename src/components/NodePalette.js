import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { generateId } from '../utils/helpers';
import { NODE_TYPES } from '../utils/constants';

const NodePalette = ({ workflow, onWorkflowChange }) => {
  const [visible, setVisible] = useState(false);

  const addNode = (nodeType) => {
    const newNode = {
      id: generateId(),
      type: nodeType.type,
      label: nodeType.label,
      position: {
        x: 100 + workflow.nodes.length * 50,
        y: 100 + workflow.nodes.length * 50,
      },
      config: nodeType.defaultConfig || {},
    };

    onWorkflowChange({
      ...workflow,
      nodes: [...workflow.nodes, newNode],
    });
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setVisible(true)}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Add Node</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.nodeList}>
            {NODE_TYPES.map((nodeType) => (
              <TouchableOpacity
                key={nodeType.type}
                style={styles.nodeCard}
                onPress={() => addNode(nodeType)}
              >
                <View style={[styles.nodeIcon, { backgroundColor: nodeType.color }]}>
                  <Icon name={nodeType.icon} size={24} color="#fff" />
                </View>
                <View style={styles.nodeInfo}>
                  <Text style={styles.nodeLabel}>{nodeType.label}</Text>
                  <Text style={styles.nodeDescription}>{nodeType.description}</Text>
                </View>
                <Icon name="plus-circle" size={24} color="#6C5CE7" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContent: {
    backgroundColor: '#16213e',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  nodeList: {
    padding: 15,
  },
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  nodeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  nodeDescription: {
    fontSize: 12,
    color: '#8899A6',
  },
});

export default NodePalette;