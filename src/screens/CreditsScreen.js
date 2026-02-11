import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Button,
  Portal,
  Modal,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserStore } from '../store/userStore';
import CreditService from '../services/CreditService';
import { formatCurrency, formatNumber, formatDateTime } from '../utils/helpers';

const CreditsScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const updateCredits = useUserStore((state) => state.updateCredits);

  useEffect(() => {
    loadCreditsData();
  }, []);

  const loadCreditsData = async () => {
    setLoading(true);
    try {
      const [currentBalance, creditHistory] = await Promise.all([
        CreditService.getBalance(),
        CreditService.getHistory(),
      ]);
      setBalance(currentBalance);
      setHistory(creditHistory);
    } catch (error) {
      Alert.alert('Error', 'Failed to load credits data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (package_) => {
    setSelectedPackage(package_);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPackage) return;

    setPurchasing(true);
    try {
      // In production, this would open Stripe payment sheet
      // For now, simulate purchase
      await CreditService.addCredits(
        selectedPackage.credits + selectedPackage.bonus,
        `purchase_${selectedPackage.id}`
      );

      const newBalance = await CreditService.getBalance();
      setBalance(newBalance);
      updateCredits(newBalance);

      Alert.alert(
        'Purchase Successful',
        `${formatNumber(selectedPackage.credits + selectedPackage.bonus)} credits added to your account`
      );
      
      setShowPurchaseModal(false);
      await loadCreditsData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to purchase credits');
    } finally {
      setPurchasing(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? 'plus-circle' : 'minus-circle';
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? '#00B894' : '#FF6B6B';
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
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Card.Content>
            <View style={styles.balanceHeader}>
              <Icon name="wallet" size={32} color="#6C5CE7" />
              <Text style={styles.balanceLabel}>Current Balance</Text>
            </View>
            <Text style={styles.balanceAmount}>{formatNumber(balance)}</Text>
            <Text style={styles.balanceSubtext}>credits available</Text>
            <Button
              mode="contained"
              onPress={() => setShowPurchaseModal(true)}
              style={styles.addCreditsButton}
              icon="plus"
            >
              Add Credits
            </Button>
          </Card.Content>
        </Card>

        {/* Credit Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit Packages</Text>
          <View style={styles.packagesGrid}>
            {CreditService.CREDIT_PACKAGES.map((package_) => (
              <Card key={package_.id} style={styles.packageCard}>
                <Card.Content>
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageCredits}>
                      {formatNumber(package_.credits)}
                    </Text>
                    {package_.bonus > 0 && (
                      <View style={styles.bonusBadge}>
                        <Text style={styles.bonusText}>+{package_.bonus}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.packageLabel}>credits</Text>
                  <Text style={styles.packagePrice}>
                    {formatCurrency(package_.price)}
                  </Text>
                  <Button
                    mode="outlined"
                    onPress={() => handlePurchase(package_)}
                    style={styles.packageButton}
                  >
                    Purchase
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Usage Information */}
        <Card style={styles.usageCard}>
          <Card.Content>
            <Text style={styles.usageTitle}>Credit Usage</Text>
            <View style={styles.usageList}>
              {Object.entries(CreditService.CREDIT_COSTS).map(([key, cost]) => (
                <View key={key} style={styles.usageItem}>
                  <Text style={styles.usageOperation}>
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.usageCost}>{cost} credits</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {history.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  No transactions yet
                </Text>
              </Card.Content>
            </Card>
          ) : (
            history.map((transaction) => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <Card.Content>
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionLeft}>
                      <Icon
                        name={getTransactionIcon(transaction.type)}
                        size={24}
                        color={getTransactionColor(transaction.type)}
                      />
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionSource}>
                          {transaction.source || transaction.reason}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {formatDateTime(transaction.timestamp)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          { color: getTransactionColor(transaction.type) },
                        ]}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatNumber(transaction.amount)}
                      </Text>
                      <Text style={styles.transactionBalance}>
                        Balance: {formatNumber(transaction.balanceAfter)}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Portal>
        <Modal
          visible={showPurchaseModal}
          onDismiss={() => setShowPurchaseModal(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Purchase Credits</Text>
            <TouchableOpacity onPress={() => setShowPurchaseModal(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedPackage ? (
            <View style={styles.modalContent}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Credits</Text>
                  <Text style={styles.summaryValue}>
                    {formatNumber(selectedPackage.credits)}
                  </Text>
                </View>
                {selectedPackage.bonus > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Bonus</Text>
                    <Text style={[styles.summaryValue, { color: '#00B894' }]}>
                      +{formatNumber(selectedPackage.bonus)}
                    </Text>
                  </View>
                )}
                <Divider style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryTotal}>
                    {formatNumber(selectedPackage.credits + selectedPackage.bonus)}
                  </Text>
                </View>
              </View>

              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Amount to Pay</Text>
                <Text style={styles.priceAmount}>
                  {formatCurrency(selectedPackage.price)}
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={confirmPurchase}
                loading={purchasing}
                disabled={purchasing}
                style={styles.confirmButton}
              >
                Confirm Purchase
              </Button>

              <Text style={styles.paymentNotice}>
                Payment will be processed securely through Stripe
              </Text>
            </View>
          ) : (
            <View style={styles.packagesListModal}>
              {CreditService.CREDIT_PACKAGES.map((package_) => (
                <TouchableOpacity
                  key={package_.id}
                  style={styles.packageRowModal}
                  onPress={() => setSelectedPackage(package_)}
                >
                  <View style={styles.packageInfoModal}>
                    <Text style={styles.packageCreditsModal}>
                      {formatNumber(package_.credits)}
                      {package_.bonus > 0 && (
                        <Text style={styles.bonusTextModal}>
                          {' '}+{package_.bonus}
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.packageLabelModal}>credits</Text>
                  </View>
                  <Text style={styles.packagePriceModal}>
                    {formatCurrency(package_.price)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Modal>
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
  balanceCard: {
    backgroundColor: '#6C5CE7',
    margin: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 20,
  },
  addCreditsButton: {
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  packageCard: {
    backgroundColor: '#16213e',
    width: '48%',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  packageCredits: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  bonusBadge: {
    backgroundColor: '#00B894',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 5,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageLabel: {
    fontSize: 14,
    color: '#8899A6',
    textAlign: 'center',
    marginBottom: 10,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    textAlign: 'center',
    marginBottom: 15,
  },
  packageButton: {
    borderColor: '#6C5CE7',
  },
  usageCard: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  usageList: {
    gap: 10,
  },
  usageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageOperation: {
    fontSize: 13,
    color: '#8899A6',
  },
  usageCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  transactionCard: {
    backgroundColor: '#16213e',
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionSource: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#8899A6',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionBalance: {
    fontSize: 11,
    color: '#8899A6',
  },
  emptyCard: {
    backgroundColor: '#16213e',
  },
  emptyText: {
    color: '#8899A6',
    textAlign: 'center',
    fontSize: 14,
  },
  modal: {
    backgroundColor: '#16213e',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    gap: 15,
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8899A6',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  divider: {
    backgroundColor: '#0f3460',
    marginVertical: 5,
  },
  priceCard: {
    backgroundColor: '#6C5CE720',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8899A6',
    marginBottom: 5,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  confirmButton: {
    paddingVertical: 8,
  },
  paymentNotice: {
    fontSize: 12,
    color: '#8899A6',
    textAlign: 'center',
  },
  packagesListModal: {
    gap: 10,
  },
  packageRowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
  },
  packageInfoModal: {
    flex: 1,
  },
  packageCreditsModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bonusTextModal: {
    color: '#00B894',
  },
  packageLabelModal: {
    fontSize: 12,
    color: '#8899A6',
  },
  packagePriceModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
});

export default CreditsScreen;