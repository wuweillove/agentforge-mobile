import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  TextInput,
  Button,
  Portal,
  Dialog,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  storeApiKey,
  getApiKey,
  deleteApiKey,
  hasApiKey,
  validateApiKey,
  getConfiguredProviders,
} from '../services/SecureStorage';
import { API_PROVIDERS } from '../utils/constants';

const APIKeysScreen = ({ navigation }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const configuredProviders = await getConfiguredProviders();
      const providerStatus = await Promise.all(
        API_PROVIDERS.map(async (provider) => ({
          ...provider,
          configured: configuredProviders.includes(provider.id),
          keyExists: await hasApiKey(provider.id),
        }))
      );
      setProviders(providerStatus);
    } catch (error) {
      Alert.alert('Error', 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = (provider) => {
    setSelectedProvider(provider);
    setApiKeyInput('');
    setShowAddDialog(true);
  };

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    // Validate API key format
    const validation = validateApiKey(selectedProvider.id, apiKeyInput);
    if (!validation.valid) {
      Alert.alert('Invalid Format', validation.error);
      return;
    }

    setSaving(true);
    try {
      await storeApiKey(selectedProvider.id, apiKeyInput);
      Alert.alert('Success', `${selectedProvider.name} API key saved securely`);
      setShowAddDialog(false);
      setApiKeyInput('');
      await loadProviders();
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = (provider) => {
    Alert.alert(
      'Delete API Key',
      `Are you sure you want to delete the ${provider.name} API key?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteApiKey(provider.id);
              Alert.alert('Success', 'API key deleted');
              await loadProviders();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete API key');
            }
          },
        },
      ]
    );
  };

  const handleViewDocs = (provider) => {
    Alert.alert(
      provider.name,
      `Visit ${provider.signupUrl} to get your API key`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => {} },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>API Keys</Text>
          <Text style={styles.headerSubtitle}>
            Securely store your AI provider API keys
          </Text>
        </View>

        {/* Security Notice */}
        <Card style={styles.noticeCard}>
          <Card.Content style={styles.noticeContent}>
            <Icon name="shield-check" size={24} color="#00B894" />
            <View style={styles.noticeText}>
              <Text style={styles.noticeTitle}>Encrypted Storage</Text>
              <Text style={styles.noticeDescription}>
                All API keys are encrypted and stored securely on your device
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Provider Cards */}
        <View style={styles.providersSection}>
          {providers.map((provider) => (
            <Card key={provider.id} style={styles.providerCard}>
              <Card.Content>
                <View style={styles.providerHeader}>
                  <View style={styles.providerInfo}>
                    <View
                      style={[
                        styles.providerIcon,
                        { backgroundColor: provider.color + '20' },
                      ]}
                    >
                      <Icon name={provider.icon} size={24} color={provider.color} />
                    </View>
                    <View style={styles.providerDetails}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <Text style={styles.providerDescription}>
                        {provider.description}
                      </Text>
                    </View>
                  </View>
                  {provider.configured && (
                    <Chip
                      style={styles.configuredChip}
                      textStyle={styles.chipText}
                      icon="check"
                    >
                      Configured
                    </Chip>
                  )}
                </View>

                <View style={styles.providerActions}>
                  {provider.configured ? (
                    <>
                      <Button
                        mode="outlined"
                        onPress={() => handleDeleteKey(provider)}
                        textColor="#FF6B6B"
                        style={styles.actionButton}
                      >
                        Remove
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => handleAddKey(provider)}
                        style={styles.actionButton}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        mode="text"
                        onPress={() => handleViewDocs(provider)}
                        textColor="#8899A6"
                        style={styles.actionButton}
                      >
                        Get Key
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => handleAddKey(provider)}
                        style={styles.actionButton}
                      >
                        Add Key
                      </Button>
                    </>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Usage Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>How to use API Keys</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Icon name="numeric-1-circle" size={20} color="#6C5CE7" />
                <Text style={styles.infoText}>
                  Sign up for an account with the AI provider
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="numeric-2-circle" size={20} color="#6C5CE7" />
                <Text style={styles.infoText}>
                  Generate an API key from their dashboard
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="numeric-3-circle" size={20} color="#6C5CE7" />
                <Text style={styles.infoText}>
                  Add the key here to use it in your workflows
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add/Update Key Dialog */}
      <Portal>
        <Dialog
          visible={showAddDialog}
          onDismiss={() => setShowAddDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            {selectedProvider?.name} API Key
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="API Key"
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              mode="outlined"
              secureTextEntry
              placeholder={selectedProvider?.keyFormat}
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
            />
            <Text style={styles.helperText}>
              Your API key will be encrypted and stored securely
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowAddDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSaveKey}
              loading={saving}
              disabled={saving}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8899A6',
  },
  noticeCard: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  noticeDescription: {
    fontSize: 13,
    color: '#8899A6',
  },
  providersSection: {
    padding: 20,
    paddingTop: 0,
  },
  providerCard: {
    backgroundColor: '#16213e',
    marginBottom: 15,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  providerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  providerDescription: {
    fontSize: 13,
    color: '#8899A6',
    lineHeight: 18,
  },
  configuredChip: {
    backgroundColor: '#00B89420',
    borderColor: '#00B894',
    borderWidth: 1,
  },
  chipText: {
    color: '#00B894',
    fontSize: 11,
  },
  providerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#16213e',
    margin: 20,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#8899A6',
    lineHeight: 20,
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
    fontSize: 12,
    color: '#8899A6',
    marginTop: 5,
  },
});

export default APIKeysScreen;