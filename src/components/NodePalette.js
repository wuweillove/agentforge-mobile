import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Portal, Modal, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NODE_TYPES } from '../utils/constants';
import { generateId } from '../utils/helpers';

const NodePalette = ({ workflow, onWorkflowChange }) => {
  const [visible, setVisible] = useState(false);

  const handleAddNode = (nodeType) => {
    const newNode = {
      id: generateId(),
      type: nodeType.type,
      label: nodeType.label,
      position: {
        x: 100 + workflow.nodes.length * 30,
        y: 100 + workflow.nodes.length * 30,
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
      <IconButton
        icon="plus-box"
        size={32}
        iconColor="#6C5CE7"
        style={styles.fabButton}
        onPress={() => setVisible(true)}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Node</Text>
            <IconButton
              icon="close"
              size={24}
              iconColor="#fff"
              onPress={() => setVisible(false)}
            />
          </View>

          <ScrollView style={styles.nodeList}>
            {NODE_TYPES.map((nodeType) => (
              <TouchableOpacity
                key={nodeType.type}
                style={styles.nodeItem}
                onPress={() => handleAddNode(nodeType)}
              >
                <View
                  style={[
                    styles.nodeIcon,
                    { backgroundColor: nodeType.color },
                  ]}
                >
                  <Icon name={nodeType.icon} size={24} color="#fff" />
                </View>
                <View style={styles.nodeInfo}>
                  <Text style={styles.nodeLabel}>{nodeType.label}</Text>
                  <Text style={styles.nodeDescription}>
                    {nodeType.description}
                  </Text>
                </View>
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
    backgroundColor: '#16213e',
    borderRadius: 8,
  },
  modal: {
    backgroundColor: '#16213e',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  nodeList: {
    padding: 15,
  },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a2e',
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
    fontSize: 13,
    color: '#8899A6',
  },
});

export default NodePalette;
