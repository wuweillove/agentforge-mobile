import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, ProgressBar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkflowStore } from '../store/workflowStore';
import { formatDistanceToNow } from 'date-fns';

const MonitorScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const workflows = useWorkflowStore((state) => state.workflows);
  const activeWorkflows = workflows.filter(w => w.status === 'active');

  const [agentStats, setAgentStats] = useState({
    totalExecutions: 156,
    successRate: 94.2,
    activeAgents: activeWorkflows.length,
    avgResponseTime: 1.2,
  });

  const [recentExecutions, setRecentExecutions] = useState([
    {
      id: '1',
      workflowName: 'Data Processing Pipeline',
      status: 'success',
      startTime: new Date(Date.now() - 5 * 60000).toISOString(),
      duration: 2.3,
      nodesExecuted: 8,
    },
    {
      id: '2',
      workflowName: 'Email Automation',
      status: 'running',
      startTime: new Date(Date.now() - 2 * 60000).toISOString(),
      progress: 65,
      nodesExecuted: 4,
    },
    {
      id: '3',
      workflowName: 'Content Analysis',
      status: 'failed',
      startTime: new Date(Date.now() - 15 * 60000).toISOString(),
      error: 'API timeout',
      nodesExecuted: 3,
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#00B894';
      case 'running': return '#74B9FF';
      case 'failed': return '#FF6B6B';
      default: return '#8899A6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'check-circle';
      case 'running': return 'sync';
      case 'failed': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="play-circle" size={24} color="#6C5CE7" />
            <Text style={styles.statValue}>{agentStats.activeAgents}</Text>
            <Text style={styles.statLabel}>Active Agents</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="check-all" size={24} color="#00B894" />
            <Text style={styles.statValue}>{agentStats.totalExecutions}</Text>
            <Text style={styles.statLabel}>Total Executions</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="percent" size={24} color="#FDCB6E" />
            <Text style={styles.statValue}>{agentStats.successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="timer" size={24} color="#74B9FF" />
            <Text style={styles.statValue}>{agentStats.avgResponseTime}s</Text>
            <Text style={styles.statLabel}>Avg Response</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Executions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Executions</Text>

        {recentExecutions.map((execution) => (
          <Card key={execution.id} style={styles.executionCard}>
            <Card.Content>
              <View style={styles.executionHeader}>
                <View style={styles.executionTitleContainer}>
                  <Icon
                    name={getStatusIcon(execution.status)}
                    size={20}
                    color={getStatusColor(execution.status)}
                  />
                  <Text style={styles.executionTitle}>
                    {execution.workflowName}
                  </Text>
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(execution.status) },
                  ]}
                  textStyle={styles.statusChipText}
                >
                  {execution.status}
                </Chip>
              </View>

              {execution.status === 'running' && (
                <View style={styles.progressContainer}>
                  <ProgressBar
                    progress={execution.progress / 100}
                    color="#6C5CE7"
                    style={styles.progressBar}
                  />
                  <Text style={styles.progressText}>{execution.progress}%</Text>
                </View>
              )}

              <View style={styles.executionDetails}>
                <View style={styles.executionDetail}>
                  <Icon name="clock-outline" size={14} color="#8899A6" />
                  <Text style={styles.detailText}>
                    {formatDistanceToNow(new Date(execution.startTime), {
                      addSuffix: true,
                    })}
                  </Text>
                </View>

                <View style={styles.executionDetail}>
                  <Icon name="graph" size={14} color="#8899A6" />
                  <Text style={styles.detailText}>
                    {execution.nodesExecuted} nodes
                  </Text>
                </View>

                {execution.duration && (
                  <View style={styles.executionDetail}>
                    <Icon name="timer" size={14} color="#8899A6" />
                    <Text style={styles.detailText}>
                      {execution.duration}s
                    </Text>
                  </View>
                )}
              </View>

              {execution.error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Error: {execution.error}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}

        {recentExecutions.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No recent executions. Deploy a workflow to see activity.
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#16213e',
    flex: 1,
    minWidth: '47%',
  },
  statContent: {
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8899A6',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  executionCard: {
    backgroundColor: '#16213e',
    marginBottom: 12,
  },
  executionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  executionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  executionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0f3460',
  },
  progressText: {
    fontSize: 12,
    color: '#8899A6',
    marginTop: 4,
    textAlign: 'right',
  },
  executionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  executionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#8899A6',
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FF6B6B20',
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
  },
  emptyCard: {
    backgroundColor: '#16213e',
  },
  emptyText: {
    color: '#8899A6',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default MonitorScreen;
