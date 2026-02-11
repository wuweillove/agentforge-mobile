import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { List, Divider, Button, TextInput, Portal, Dialog } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkflowStore } from '../store/workflowStore';

const SettingsScreen = () => {
  const [apiKeyDialog, setApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const clearWorkflows = useWorkflowStore((state) => state.clearWorkflows);

  const handleSaveApiKey = () => {
    // TODO: Save to secure storage
    setApiKeyDialog(false);
    Alert.alert('Success', 'API key saved successfully');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all workflows and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            clearWorkflows();
            Alert.alert('Success', 'All data cleared');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export', 'Export functionality coming soon');
  };

  const handleImportData = () => {
    Alert.alert('Import', 'Import functionality coming soon');
  };

  return (
    <ScrollView style={styles.container}>
      {/* OpenClaw API */}
      <List.Section>
        <List.Subheader style={styles.subheader}>OpenClaw Integration</List.Subheader>
        <List.Item
          title="API Configuration"
          description="Configure OpenClaw API settings"
          left={(props) => <List.Icon {...props} icon="api" color="#6C5CE7" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#8899A6" />}
          onPress={() => setApiKeyDialog(true)}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />
      </List.Section>

      {/* Preferences */}
      <List.Section>
        <List.Subheader style={styles.subheader}>Preferences</List.Subheader>
        <List.Item
          title="Auto-save"
          description="Automatically save workflow changes"
          left={(props) => <List.Icon {...props} icon="content-save-auto" color="#00B894" />}
          right={() => (
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#657786', true: '#6C5CE7' }}
            />
          )}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Notifications"
          description="Receive workflow execution alerts"
          left={(props) => <List.Icon {...props} icon="bell" color="#FDCB6E" />}
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#657786', true: '#6C5CE7' }}
            />
          )}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Dark Mode"
          description="Use dark theme (always on)"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" color="#74B9FF" />}
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#657786', true: '#6C5CE7' }}
              disabled
            />
          )}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />
      </List.Section>

      {/* Data Management */}
      <List.Section>
        <List.Subheader style={styles.subheader}>Data Management</List.Subheader>
        <List.Item
          title="Export Workflows"
          description="Export all workflows as JSON"
          left={(props) => <List.Icon {...props} icon="export" color="#00B894" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#8899A6" />}
          onPress={handleExportData}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Import Workflows"
          description="Import workflows from JSON file"
          left={(props) => <List.Icon {...props} icon="import" color="#74B9FF" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#8899A6" />}
          onPress={handleImportData}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Clear All Data"
          description="Delete all workflows and settings"
          left={(props) => <List.Icon {...props} icon="delete" color="#FF6B6B" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#8899A6" />}
          onPress={handleClearData}
          titleStyle={[styles.listTitle, { color: '#FF6B6B' }]}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />
      </List.Section>

      {/* About */}
      <List.Section>
        <List.Subheader style={styles.subheader}>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" color="#8899A6" />}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />

        <List.Item
          title="Documentation"
          description="View user guide and API docs"
          left={(props) => <List.Icon {...props} icon="book-open" color="#6C5CE7" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#8899A6" />}
          onPress={() => Alert.alert('Docs', 'Documentation coming soon')}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          style={styles.listItem}
        />
        <Divider style={styles.divider} />
      </List.Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built by Sebastian Llovera Studio</Text>
        <Text style={styles.footerText}>© 2026 AgentForge</Text>
      </View>

      {/* API Key Dialog */}
      <Portal>
        <Dialog
          visible={apiKeyDialog}
          onDismiss={() => setApiKeyDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>OpenClaw API Key</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="API Key"
              value={apiKey}
              onChangeText={setApiKey}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
            />
            <Text style={styles.helperText}>
              Get your API key from the OpenClaw dashboard
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setApiKeyDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveApiKey}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  subheader: {
    color: '#8899A6',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listItem: {
    backgroundColor: '#16213e',
  },
  listTitle: {
    color: '#fff',
    fontSize: 16,
  },
  listDescription: {
    color: '#8899A6',
    fontSize: 13,
  },
  divider: {
    backgroundColor: '#0f3460',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#657786',
    fontSize: 12,
    marginVertical: 2,
  },
  dialog: {
    backgroundColor: '#16213e',
  },
  dialogTitle: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#1a1a2e',
    marginBottom: 10,
  },
  helperText: {
    color: '#8899A6',
    fontSize: 12,
  },
});

export default SettingsScreen;
