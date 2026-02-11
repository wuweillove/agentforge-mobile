import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkflowStore } from '../store/workflowStore';

const { width } = Dimensions.get('window');

const DashboardMetrics = () => {
  const workflows = useWorkflowStore((state) => state.workflows);
  
  const metrics = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === 'active').length,
    totalNodes: workflows.reduce((acc, w) => acc + (w.nodes?.length || 0), 0),
    avgNodesPerWorkflow: workflows.length > 0
      ? Math.round(workflows.reduce((acc, w) => acc + (w.nodes?.length || 0), 0) / workflows.length)
      : 0,
  };

  const MetricCard = ({ icon, value, label, color }) => (
    <Card style={styles.metricCard}>
      <Card.Content style={styles.metricContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.metricsRow}>
        <MetricCard
          icon="file-document-multiple"
          value={metrics.totalWorkflows}
          label="Total Workflows"
          color="#6C5CE7"
        />
        <MetricCard
          icon="play-circle"
          value={metrics.activeWorkflows}
          label="Active"
          color="#00B894"
        />
      </View>
      <View style={styles.metricsRow}>
        <MetricCard
          icon="graph"
          value={metrics.totalNodes}
          label="Total Nodes"
          color="#FDCB6E"
        />
        <MetricCard
          icon="chart-box"
          value={metrics.avgNodesPerWorkflow}
          label="Avg Nodes"
          color="#74B9FF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricCard: {
    backgroundColor: '#16213e',
    width: (width - 50) / 2,
  },
  metricContent: {
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#8899A6',
    textAlign: 'center',
  },
});

export default DashboardMetrics;