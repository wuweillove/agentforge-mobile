import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkflowStore } from '../store/workflowStore';

const DashboardMetrics = () => {
  const workflows = useWorkflowStore((state) => state.workflows);

  const metrics = {
    total: workflows.length,
    active: workflows.filter((w) => w.status === 'active').length,
    draft: workflows.filter((w) => w.status === 'draft').length,
    totalNodes: workflows.reduce((sum, w) => sum + (w.nodes?.length || 0), 0),
  };

  const activePercentage = metrics.total > 0 ? metrics.active / metrics.total : 0;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title}>Overview</Text>
            <Icon name="chart-line" size={20} color="#6C5CE7" />
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{metrics.total}</Text>
              <Text style={styles.metricLabel}>Total Workflows</Text>
            </View>

            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: '#00B894' }]}>
                {metrics.active}
              </Text>
              <Text style={styles.metricLabel}>Active</Text>
            </View>

            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: '#74B9FF' }]}>
                {metrics.draft}
              </Text>
              <Text style={styles.metricLabel}>Draft</Text>
            </View>

            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: '#FDCB6E' }]}>
                {metrics.totalNodes}
              </Text>
              <Text style={styles.metricLabel}>Total Nodes</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Active Workflows</Text>
              <Text style={styles.progressValue}>
                {Math.round(activePercentage * 100)}%
              </Text>
            </View>
            <ProgressBar
              progress={activePercentage}
              color="#00B894"
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#16213e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  metric: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#8899A6',
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#fff',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00B894',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0f3460',
  },
});

export default DashboardMetrics;
