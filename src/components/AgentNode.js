import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NODE_TYPES } from '../utils/constants';

const AgentNode = ({ node, selected, onMove, onDelete, onSelect }) => {
  const pan = useRef(new Animated.ValueXY(node.position)).current;

  const nodeType = NODE_TYPES.find((t) => t.type === node.type);
  const nodeColor = nodeType?.color || '#6C5CE7';
  const nodeIcon = nodeType?.icon || 'help-circle';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onSelect(node.id);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        const newPosition = {
          x: pan.x._value,
          y: pan.y._value,
        };
        onMove(node.id, newPosition);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.node,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          borderColor: selected ? '#6C5CE7' : 'transparent',
          borderWidth: selected ? 2 : 0,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.nodeHeader, { backgroundColor: nodeColor }]}>
        <Icon name={nodeIcon} size={16} color="#fff" />
        <Text style={styles.nodeType}>{node.type}</Text>
        {selected && (
          <TouchableOpacity
            onPress={() => onDelete(node.id)}
            style={styles.deleteButton}
          >
            <Icon name="close" size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.nodeBody}>
        <Text style={styles.nodeLabel} numberOfLines={2}>
          {node.label}
        </Text>
      </View>
      <View style={styles.connectionPoints}>
        <View style={[styles.connectionDot, styles.inputDot]} />
        <View style={[styles.connectionDot, styles.outputDot]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    width: 140,
    backgroundColor: '#16213e',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  nodeType: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    flex: 1,
  },
  deleteButton: {
    padding: 2,
  },
  nodeBody: {
    padding: 10,
  },
  nodeLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  connectionPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  inputDot: {
    backgroundColor: '#1a1a2e',
  },
  outputDot: {
    backgroundColor: '#6C5CE7',
  },
});

export default AgentNode;
