import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, TextInput, Portal, Dialog } from 'react-native-paper';
import { useWorkflowStore } from '../store/workflowStore';
import WorkflowCanvas from '../components/WorkflowCanvas';
import NodePalette from '../components/NodePalette';
import { generateId } from '../utils/helpers';

const WorkflowBuilderScreen = ({ route, navigation }) => {
  const { mode, workflowId } = route.params || { mode: 'create' };
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const workflows = useWorkflowStore((state) => state.workflows);
  const addWorkflow = useWorkflowStore((state) => state.addWorkflow);
  const updateWorkflow = useWorkflowStore((state) => state.updateWorkflow);

  const [currentWorkflow, setCurrentWorkflow] = useState({
    id: workflowId || generateId(),
    name: '',
    description: '',
    nodes: [],
    connections: [],
    status: 'draft',
  });

  useEffect(() => {
    if (mode === 'edit' && workflowId) {
      const existing = workflows.find(w => w.id === workflowId);
      if (existing) {
        setCurrentWorkflow(existing);
        setWorkflowName(existing.name);
        setWorkflowDescription(existing.description || '');
      }
    }
  }, [mode, workflowId, workflows]);

  const handleSave = () => {
    if (!workflowName.trim()) {
      Alert.alert('Error', 'Please enter a workflow name');
      return;
    }

    const workflowData = {
      ...currentWorkflow,
      name: workflowName,
      description: workflowDescription,
      updatedAt: new Date().toISOString(),
    };

    if (mode === 'edit') {
      updateWorkflow(workflowId, workflowData);
    } else {
      addWorkflow(workflowData);
    }

    setShowSaveDialog(false);
    Alert.alert('Success', 'Workflow saved successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleDeploy = () => {
    if (!currentWorkflow.nodes.length) {
      Alert.alert('Error', 'Add at least one node before deploying');
      return;
    }

    Alert.alert(
      'Deploy Workflow',
      'Deploy this workflow to OpenClaw?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deploy',
          onPress: () => {
            // TODO: Integrate with OpenClaw API
            const deployed = {
              ...currentWorkflow,
              status: 'active',
              deployedAt: new Date().toISOString(),
            };
            setCurrentWorkflow(deployed);
            Alert.alert('Success', 'Workflow deployed successfully');
          },
        },
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Button
            mode="text"
            onPress={() => setShowSaveDialog(true)}
            textColor="#fff"
          >
            Save
          </Button>
          <Button
            mode="text"
            onPress={handleDeploy}
            textColor="#00B894"
          >
            Deploy
          </Button>
        </View>
      ),
    });
  }, [navigation, currentWorkflow]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <WorkflowCanvas
          workflow={currentWorkflow}
          onWorkflowChange={setCurrentWorkflow}
        />
        <NodePalette
          workflow={currentWorkflow}
          onWorkflowChange={setCurrentWorkflow}
        />

        <Portal>
          <Dialog
            visible={showSaveDialog}
            onDismiss={() => setShowSaveDialog(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Save Workflow</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Workflow Name"
                value={workflowName}
                onChangeText={setWorkflowName}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
              />
              <TextInput
                label="Description (optional)"
                value={workflowDescription}
                onChangeText={setWorkflowDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowSaveDialog(false)}>Cancel</Button>
              <Button onPress={handleSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  dialog: {
    backgroundColor: '#16213e',
  },
  dialogTitle: {
    color: '#fff',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#1a1a2e',
  },
});

export default WorkflowBuilderScreen;
