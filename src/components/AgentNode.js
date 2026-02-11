import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NODE_TYPES } from '../utils/constants';

const AgentNode = ({
  node,
  isSelected,
  onPress,
  onMove,
  onDelete,
  onStartConnection,
  onCompleteConnection,
  isConnecting,
}) => {
  const pan = useRef(new Animated.ValueXY(node.position)).current;

  const nodeType = NODE_TYPES.find(t => t.type === node.type);
  const color = nodeType?.color || '#6C5CE7';
  const icon = nodeType?.icon || 'circle';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
        onPress();
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        const newPosition = {
          x: pan.x._value,
          y: pan.y._value,
        };
        onMove(newPosition);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
        isSelected && styles.selected,
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.node, { borderColor: color }]}>
        <View style={[styles.header, { backgroundColor: color }]}>
          <Icon name={icon} size={16} color="#fff" />
          <Text style={styles.label} numberOfLines={1}>{node.label}</Text>
          {isSelected && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.body}>
          <Text style={styles.type}>{node.type}</Text>
        </View>

        {/* Connection Points */}
        <TouchableOpacity
          style={[styles.connector, styles.inputConnector]}
          onPress={onCompleteConnection}
        >
          <View style={styles.connectorDot} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.connector, styles.outputConnector]}
          onPress={onStartConnection}
        >
          <View style={[styles.connectorDot, isConnecting && styles.connectorActive]} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  node: {
    width: 120,
    backgroundColor: '#16213e',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  selected: {
    elevation: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  label: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 2,
  },
  body: {
    padding: 8,
    paddingTop: 4,
  },
  type: {
    fontSize: 10,
    color: '#8899A6',
    textTransform: 'uppercase',
  },
  connector: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#16213e',
    borderWidth: 2,
    borderColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputConnector: {
    top: '50%',
    left: -8,
    marginTop: -8,
  },
  outputConnector: {
    top: '50%',
    right: -8,
    marginTop: -8,
  },
  connectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6C5CE7',
  },
  connectorActive: {
    backgroundColor: '#00B894',
  },
});

export default AgentNode;