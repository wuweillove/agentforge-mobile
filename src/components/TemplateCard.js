import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TemplateCard = ({ template, onUse }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Data Processing': '#6C5CE7',
      'Communication': '#00B894',
      'Analysis': '#FDCB6E',
      'Automation': '#74B9FF',
    };
    return colors[category] || '#8899A6';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Data Processing': 'database',
      'Communication': 'message',
      'Analysis': 'chart-line',
      'Automation': 'robot',
    };
    return icons[category] || 'file';
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(template.category) }
          ]}>
            <Icon
              name={getCategoryIcon(template.category)}
              size={16}
              color="#fff"
            />
          </View>
          <Text style={styles.category}>{template.category}</Text>
        </View>

        <Text style={styles.title}>{template.name}</Text>
        <Text style={styles.description}>{template.description}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="graph" size={14} color="#8899A6" />
            <Text style={styles.statText}>{template.nodes?.length || 0} nodes</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="clock-outline" size={14} color="#8899A6" />
            <Text style={styles.statText}>{template.estimatedTime || '5'} min</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.useButton} onPress={onUse}>
          <Text style={styles.useButtonText}>Use Template</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  category: {
    fontSize: 12,
    color: '#8899A6',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8899A6',
    marginBottom: 15,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#8899A6',
  },
  useButton: {
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TemplateCard;