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
  Button,
  Portal,
  Dialog,
  TextInput,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StripePayments from '../services/StripePayments';
import { formatDateTime } from '../utils/helpers';

const PaymentScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      const [methods, invoicesList] = await Promise.all([
        StripePayments.getPaymentMethods(),
        StripePayments.getInvoices(),
      ]);
      setPaymentMethods(methods || []);
      setInvoices(invoicesList || []);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !expiry || !cvv || !cardholderName) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Invalid card number');
      return;
    }

    setProcessing(true);
    try {
      // In production, use Stripe SDK to create token
      // For demo, simulate adding card
      const newCard = {
        id: `pm_${Date.now()}`,
        brand: 'Visa',
        last4: cardNumber.slice(-4),
        expMonth: parseInt(expiry.split('/')[0]),
        expYear: parseInt('20' + expiry.split('/')[1]),
        isDefault: paymentMethods.length === 0,
      };

      await StripePayments.addPaymentMethod(newCard.id);
      
      Alert.alert('Success', 'Payment method added successfully');
      setShowAddCard(false);
      resetCardForm();
      await loadPaymentData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add payment method');
    } finally {
      setProcessing(false);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await StripePayments.setDefaultPaymentMethod(methodId);
      Alert.alert('Success', 'Default payment method updated');
      await loadPaymentData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const handleDeleteCard = (method) => {
    Alert.alert(
      'Remove Card',
      `Are you sure you want to remove card ending in ${method.last4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await StripePayments.deletePaymentMethod(method.id);
              Alert.alert('Success', 'Payment method removed');
              await loadPaymentData();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove payment method');
            }
          },
        },
      ]
    );
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      await StripePayments.downloadInvoice(invoice.id);
      Alert.alert('Success', 'Invoice downloaded');
    } catch (error) {
      Alert.alert('Error', 'Failed to download invoice');
    }
  };

  const resetCardForm = () => {
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardholderName('');
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getCardIcon = (brand) => {
    const icons = {
      Visa: 'credit-card',
      Mastercard: 'credit-card',
      Amex: 'credit-card',
      Discover: 'credit-card',
    };
    return icons[brand] || 'credit-card';
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: '#00B894',
      pending: '#FDCB6E',
      failed: '#FF6B6B',
    };
    return colors[status] || '#8899A6';
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
        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <Button
              mode="text"
              onPress={() => setShowAddCard(true)}
              textColor="#6C5CE7"
              icon="plus"
            >
              Add Card
            </Button>
          </View>

          {paymentMethods.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Icon name="credit-card-off" size={48} color="#8899A6" />
                <Text style={styles.emptyText}>
                  No payment methods added yet
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setShowAddCard(true)}
                  style={styles.emptyButton}
                >
                  Add Your First Card
                </Button>
              </Card.Content>
            </Card>
          ) : (
            paymentMethods.map((method) => (
              <Card key={method.id} style={styles.cardCard}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Icon
                        name={getCardIcon(method.brand)}
                        size={32}
                        color="#6C5CE7"
                      />
                      <View style={styles.cardDetails}>
                        <Text style={styles.cardBrand}>{method.brand}</Text>
                        <Text style={styles.cardNumber}>
                          •••• •••• •••• {method.last4}
                        </Text>
                        <Text style={styles.cardExpiry}>
                          Expires {method.expMonth}/{method.expYear}
                        </Text>
                      </View>
                    </View>
                    {method.isDefault && (
                      <Chip style={styles.defaultChip} textStyle={styles.chipText}>
                        Default
                      </Chip>
                    )}
                  </View>

                  <View style={styles.cardActions}>
                    {!method.isDefault && (
                      <Button
                        mode="text"
                        onPress={() => handleSetDefault(method.id)}
                        textColor="#6C5CE7"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      mode="text"
                      onPress={() => handleDeleteCard(method)}
                      textColor="#FF6B6B"
                    >
                      Remove
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Billing History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing History</Text>
          
          {invoices.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  No invoices yet
                </Text>
              </Card.Content>
            </Card>
          ) : (
            invoices.map((invoice) => (
              <Card key={invoice.id} style={styles.invoiceCard}>
                <Card.Content>
                  <View style={styles.invoiceRow}>
                    <View style={styles.invoiceLeft}>
                      <Text style={styles.invoiceDate}>
                        {formatDateTime(invoice.date)}
                      </Text>
                      <Text style={styles.invoiceDescription}>
                        {invoice.description}
                      </Text>
                    </View>
                    <View style={styles.invoiceRight}>
                      <Text style={styles.invoiceAmount}>
                        ${invoice.amount.toFixed(2)}
                      </Text>
                      <Chip
                        style={[styles.statusChip, {
                          backgroundColor: getStatusColor(invoice.status) + '20',
                          borderColor: getStatusColor(invoice.status),
                        }]}
                        textStyle={[styles.statusText, {
                          color: getStatusColor(invoice.status),
                        }]}
                      >
                        {invoice.status}
                      </Chip>
                    </View>
                  </View>
                  
                  {invoice.status === 'paid' && (
                    <Button
                      mode="text"
                      onPress={() => handleDownloadInvoice(invoice)}
                      textColor="#6C5CE7"
                      icon="download"
                      style={styles.downloadButton}
                    >
                      Download PDF
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Card Dialog */}
      <Portal>
        <Dialog
          visible={showAddCard}
          onDismiss={() => setShowAddCard(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Add Payment Method</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Cardholder Name"
              value={cardholderName}
              onChangeText={setCardholderName}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
            />
            <TextInput
              label="Card Number"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              mode="outlined"
              keyboardType="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
            />
            <View style={styles.cardRow}>
              <TextInput
                label="Expiry"
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
                mode="outlined"
                keyboardType="numeric"
                maxLength={5}
                placeholder="MM/YY"
                style={[styles.input, styles.halfInput]}
                theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
              />
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
                mode="outlined"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholder="123"
                style={[styles.input, styles.halfInput]}
                theme={{ colors: { text: '#fff', placeholder: '#8899A6' } }}
              />
            </View>
            <Text style={styles.secureText}>
              <Icon name="lock" size={12} color="#00B894" />
              {' '}Your card information is encrypted and secure
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowAddCard(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onPress={handleAddCard}
              loading={processing}
              disabled={processing}
            >
              Add Card
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
  section: {
    padding: 20,
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
  },
  emptyCard: {
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8899A6',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
  },
  emptyButton: {
    marginTop: 10,
  },
  cardCard: {
    backgroundColor: '#16213e',
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  cardInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 15,
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: '#8899A6',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#8899A6',
  },
  defaultChip: {
    backgroundColor: '#6C5CE720',
    borderColor: '#6C5CE7',
    borderWidth: 1,
  },
  chipText: {
    color: '#6C5CE7',
    fontSize: 11,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  invoiceCard: {
    backgroundColor: '#16213e',
    marginBottom: 12,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceLeft: {
    flex: 1,
  },
  invoiceDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  invoiceDescription: {
    fontSize: 13,
    color: '#8899A6',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusChip: {
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  downloadButton: {
    marginTop: 10,
  },
  dialog: {
    backgroundColor: '#16213e',
  },
  dialogTitle: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#1a1a2e',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  secureText: {
    fontSize: 12,
    color: '#00B894',
    textAlign: 'center',
  },
});

export default PaymentScreen;