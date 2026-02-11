import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Button, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkflowStore } from '../store/workflowStore';
import DashboardMetrics from '../components/DashboardMetrics';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const workflows = useWorkflowStore((state) => state.workflows);
  const recentWorkflows = workflows.slice(0, 5);

  const handleCreateWorkflow = () => {
    navigation.navigate('WorkflowBuilder', { mode: 'create' });
  };

  const handleOpenWorkflow = (workflow) => {
    navigation.navigate('WorkflowBuilder', { 
      mode: 'edit',
      workflowId: workflow.id 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AgentForge</Text>
          <Text style={styles.headerSubtitle}>
            Build powerful AI agent workflows
          </Text>
        </View>

        {/* Metrics Dashboard */}
        <DashboardMetrics />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleCreateWorkflow}
            >
              <Icon name="plus-circle" size={32} color="#6C5CE7" />
              <Text style={styles.actionText}>New Workflow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Templates')}
            >
              <Icon name="file-document" size={32} color="#00B894" />
              <Text style={styles.actionText}>Templates</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Monitor')}
            >
              <Icon name="monitor-dashboard" size={32} color="#FDCB6E" />
              <Text style={styles.actionText}>Monitor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Workflows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Workflows</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Workflows')}
              textColor="#6C5CE7"
            >
              View All
            </Button>
          </View>

          {recentWorkflows.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  No workflows yet. Create your first workflow to get started!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            recentWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                style={styles.workflowCard}
                onPress={() => handleOpenWorkflow(workflow)}
              >
                <Card.Content>
                  <View style={styles.workflowHeader}>
                    <Text style={styles.workflowTitle}>{workflow.name}</Text>
                    <View style={[styles.statusBadge, { 
                      backgroundColor: workflow.status === 'active' ? '#00B894' : '#74B9FF'
                    }]}>
                      <Text style={styles.statusText}>{workflow.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.workflowDescription}>
                    {workflow.description || 'No description'}
                  </Text>
                  <View style={styles.workflowMeta}>
                    <Text style={styles.metaText}>
                      {workflow.nodes?.length || 0} nodes
                    </Text>
                    <Text style={styles.metaText}>•</Text>
                    <Text style={styles.metaText}>
                      Modified {new Date(workflow.updatedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreateWorkflow}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8899A6',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  actionText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  workflowCard: {
    backgroundColor: '#16213e',
    marginBottom: 12,
  },
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workflowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  workflowDescription: {
    fontSize: 14,
    color: '#8899A6',
    marginBottom: 8,
  },
  workflowMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#657786',
  },
  emptyCard: {
    backgroundColor: '#16213e',
  },
  emptyText: {
    color: '#8899A6',
    textAlign: 'center',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6C5CE7',
  },
});

export default HomeScreen;
