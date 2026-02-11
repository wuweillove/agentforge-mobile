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
  Chip,
  ActivityIndicator,
  Portal,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserStore } from '../store/userStore';
import StripePayments from '../services/StripePayments';
import { SUBSCRIPTION_TIERS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

const SubscriptionScreen = ({ navigation }) => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [processing, setProcessing] = useState(false);

  const updateSubscription = useUserStore((state) => state.updateSubscription);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setLoading(true);
    try {
      const subscription = await StripePayments.getSubscription();
      setCurrentSubscription(subscription);
    } catch (error) {
      Alert.alert('Error', 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (tier) => {
    if (tier.id === currentSubscription?.tier) {
      Alert.alert('Info', 'You are already on this plan');
      return;
    }

    if (tier.id === 'free') {
      handleDowngrade();
      return;
    }

    setSelectedTier(tier);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedTier) return;

    setProcessing(true);
    try {
      // In production, this would open Stripe payment sheet
      // For now, simulate subscription
      const newSubscription = await StripePayments.createSubscription(
        selectedTier.priceId,
        'pm_card_visa' // Demo payment method
      );

      setCurrentSubscription(newSubscription);
      updateSubscription(newSubscription);

      Alert.alert(
        'Success',
        `You have successfully upgraded to ${selectedTier.name} plan!`
      );
      
      setShowUpgradeDialog(false);
      await loadSubscription();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upgrade subscription');
    } finally {
      setProcessing(false);
    }
  };

  const handleDowngrade = () => {
    Alert.alert(
      'Downgrade to Free',
      'Your subscription will be canceled at the end of the current billing period. You will retain access to premium features until then.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              await StripePayments.cancelSubscription();
              Alert.alert('Success', 'Subscription will be canceled at period end');
              await loadSubscription();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel subscription');
            }
          },
        },
      ]
    );
  };

  const handleManagePayment = () => {
    navigation.navigate('Payment');
  };

  const renderFeature = (feature, available) => (
    <View style={styles.featureRow} key={feature}>
      <Icon
        name={available ? 'check-circle' : 'close-circle'}
        size={20}
        color={available ? '#00B894' : '#8899A6'}
      />
      <Text style={[styles.featureText, !available && styles.featureUnavailable]}>
        {feature}
      </Text>
    </View>
  );

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
        {/* Current Plan */}
        <Card style={styles.currentPlanCard}>
          <Card.Content>
            <View style={styles.currentPlanHeader}>
              <View>
                <Text style={styles.currentPlanLabel}>Current Plan</Text>
                <Text style={styles.currentPlanName}>
                  {SUBSCRIPTION_TIERS.find(t => t.id === currentSubscription?.tier)?.name || 'Free'}
                </Text>
              </View>
              {currentSubscription?.tier !== 'free' && (
                <Chip style={styles.activeChip} textStyle={styles.chipText}>
                  Active
                </Chip>
              )}
            </View>
            
            {currentSubscription?.tier !== 'free' && (
              <View style={styles.billingInfo}>
                <Text style={styles.billingText}>
                  {formatCurrency(SUBSCRIPTION_TIERS.find(t => t.id === currentSubscription.tier)?.price || 0)}/month
                </Text>
                <Text style={styles.billingDate}>
                  Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Text>
              </View>
            )}

            <Button
              mode="outlined"
              onPress={handleManagePayment}
              style={styles.manageButton}
            >
              Manage Payment Methods
            </Button>
          </Card.Content>
        </Card>

        {/* Available Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrent = tier.id === currentSubscription?.tier;
            const features = Object.entries(tier.features).map(([key, value]) => {
              if (typeof value === 'boolean') {
                return { text: key.replace(/([A-Z])/g, ' $1').trim(), available: value };
              }
              return { text: `${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`, available: true };
            });

            return (
              <Card
                key={tier.id}
                style={[
                  styles.planCard,
                  isCurrent && styles.currentCard,
                  tier.popular && styles.popularCard,
                ]}
              >
                {tier.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}
                
                <Card.Content>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{tier.name}</Text>
                    {isCurrent && (
                      <Chip style={styles.currentBadge} textStyle={styles.chipText}>
                        Current
                      </Chip>
                    )}
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      {tier.price === 0 ? 'Free' : formatCurrency(tier.price)}
                    </Text>
                    {tier.price > 0 && (
                      <Text style={styles.priceInterval}>/month</Text>
                    )}
                  </View>

                  <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Icon
                          name={feature.available ? 'check-circle' : 'close-circle'}
                          size={18}
                          color={feature.available ? '#00B894' : '#8899A6'}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            !feature.available && styles.featureUnavailable,
                          ]}
                        >
                          {feature.text}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Button
                    mode={isCurrent ? 'outlined' : 'contained'}
                    onPress={() => handleUpgrade(tier)}
                    disabled={isCurrent}
                    style={styles.planButton}
                  >
                    {isCurrent ? 'Current Plan' : tier.id === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {/* FAQ */}
        <Card style={styles.faqCard}>
          <Card.Content>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Can I change plans anytime?</Text>
              <Text style={styles.faqAnswer}>
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>What happens to my workflows?</Text>
              <Text style={styles.faqAnswer}>
                All your workflows are preserved when changing plans. If you downgrade, some features may become unavailable.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How does billing work?</Text>
              <Text style={styles.faqAnswer}>
                Subscriptions are billed monthly. You can cancel anytime and retain access until the end of your billing period.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Upgrade Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showUpgradeDialog}
          onDismiss={() => setShowUpgradeDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Upgrade to {selectedTier?.name}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              You will be charged {formatCurrency(selectedTier?.price || 0)} per month.
              Your card will be charged immediately.
            </Text>
            <View style={styles.dialogFeatures}>
              <Text style={styles.dialogFeaturesTitle}>You'll get:</Text>
              {Object.entries(selectedTier?.features || {}).map(([key, value], index) => (
                <Text key={index} style={styles.dialogFeature}>
                  • {key.replace(/([A-Z])/g, ' $1').trim()}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </Text>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowUpgradeDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onPress={confirmUpgrade}
              loading={processing}
              disabled={processing}
            >
              Confirm
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
  currentPlanCard: {
    backgroundColor: '#6C5CE7',
    margin: 20,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  currentPlanLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  currentPlanName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeChip: {
    backgroundColor: '#00B894',
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
  },
  billingInfo: {
    marginBottom: 15,
  },
  billingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  billingDate: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
  },
  manageButton: {
    borderColor: '#fff',
  },
  plansSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: '#16213e',
    marginBottom: 15,
    position: 'relative',
  },
  currentCard: {
    borderColor: '#6C5CE7',
    borderWidth: 2,
  },
  popularCard: {
    borderColor: '#FDCB6E',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FDCB6E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  currentBadge: {
    backgroundColor: '#6C5CE720',
    borderColor: '#6C5CE7',
    borderWidth: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  priceInterval: {
    fontSize: 16,
    color: '#8899A6',
    marginLeft: 5,
  },
  featuresContainer: {
    marginBottom: 20,
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  featureUnavailable: {
    color: '#8899A6',
    textDecorationLine: 'line-through',
  },
  planButton: {
    paddingVertical: 6,
  },
  faqCard: {
    backgroundColor: '#16213e',
    margin: 20,
    marginTop: 0,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
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
  dialogText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
  },
  dialogFeatures: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
  },
  dialogFeaturesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C5CE7',
    marginBottom: 10,
  },
  dialogFeature: {
    fontSize: 13,
    color: '#8899A6',
    marginBottom: 5,
  },
});

export default SubscriptionScreen;