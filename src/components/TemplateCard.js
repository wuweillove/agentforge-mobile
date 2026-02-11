import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
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

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getCategoryColor(template.category) },
            ]}
          >
            <Icon name={template.icon} size={24} color="#fff" />
          </View>
          <Chip
            style={[
              styles.categoryChip,
              { backgroundColor: getCategoryColor(template.category) + '20' },
            ]}
            textStyle={{
              color: getCategoryColor(template.category),
              fontSize: 10,
            }}
          >
            {template.category}
          </Chip>
        </View>

        <Text style={styles.title}>{template.name}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {template.description}
        </Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="graph" size={14} color="#8899A6" />
            <Text style={styles.statText}>{template.nodes.length} nodes</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="download" size={14} color="#8899A6" />
            <Text style={styles.statText}>{template.uses || 0} uses</Text>
          </View>
        </View>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          onPress={onUse}
          style={styles.useButton}
          buttonColor="#6C5CE7"
        >
          Use Template
        </Button>
      </Card.Actions>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChip: {
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8899A6',
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
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
    flex: 1,
  },
});

export default TemplateCard;
