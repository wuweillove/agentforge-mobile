import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  SegmentedButtons,
  ActivityIndicator,
  DataTable,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency, formatNumber, formatDateTime } from '../utils/helpers';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  // Mock admin data - In production, fetch from API
  const [adminData, setAdminData] = useState({
    revenue: {
      total: 48750.50,
      thisMonth: 12450.00,
      lastMonth: 10200.00,
      growth: 22.1,
    },
    users: {
      total: 1247,
      active: 892,
      newThisMonth: 156,
      churnRate: 3.2,
    },
    subscriptions: {
      free: 654,
      premium: 425,
      enterprise: 168,
      mrr: 18950.00,
    },
    credits: {
      purchased: 2450000,
      consumed: 1980000,
      revenue: 29500.00,
    },
  });

  const [recentUsers, setRecentUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'premium',
      signupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      revenue: 9.99,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'enterprise',
      signupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      revenue: 49.99,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      plan: 'free',
      signupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      revenue: 0,
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'txn_1',
      type: 'subscription',
      user: 'john@example.com',
      amount: 9.99,
      status: 'succeeded',
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_2',
      type: 'credits',
      user: 'jane@example.com',
      amount: 69.99,
      status: 'succeeded',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_3',
      type: 'subscription',
      user: 'alice@example.com',
      amount: 49.99,
      status: 'failed',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  useEffect(() => {
    loadAdminData();
  }, [timeRange]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In production: fetch from API based on timeRange
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan) => {
    const colors = {
      free: '#8899A6',
      premium: '#6C5CE7',
      enterprise: '#FDCB6E',
    };
    return colors[plan] || '#8899A6';
  };

  const getStatusColor = (status) => {
    const colors = {
      succeeded: '#00B894',
      failed: '#FF6B6B',
      pending: '#FDCB6E',
    };
    return colors[status] || '#8899A6';
  };

  const renderOverview = () => (
    <>
      {/* Revenue Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Overview</Text>
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Card.Content>
              <View style={styles.metricHeader}>
                <Icon name="currency-usd" size={24} color="#00B894" />
                <Icon
                  name={adminData.revenue.growth >= 0 ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={adminData.revenue.growth >= 0 ? '#00B894' : '#FF6B6B'}
                />
              </View>
              <Text style={styles.metricValue}>
                {formatCurrency(adminData.revenue.total)}
              </Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
              <Text style={[styles.metricChange, {
                color: adminData.revenue.growth >= 0 ? '#00B894' : '#FF6B6B'
              }]}>
                {adminData.revenue.growth >= 0 ? '+' : ''}{adminData.revenue.growth}%
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content>
              <View style={styles.metricHeader}>
                <Icon name="repeat" size={24} color="#6C5CE7" />
              </View>
              <Text style={styles.metricValue}>
                {formatCurrency(adminData.subscriptions.mrr)}
              </Text>
              <Text style={styles.metricLabel}>Monthly Recurring Revenue</Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content>
              <View style={styles.metricHeader}>
                <Icon name="account-group" size={24} color="#74B9FF" />
              </View>
              <Text style={styles.metricValue}>
                {formatNumber(adminData.users.total)}
              </Text>
              <Text style={styles.metricLabel}>Total Users</Text>
              <Text style={styles.metricChange}>
                +{adminData.users.newThisMonth} this month
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content>
              <View style={styles.metricHeader}>
                <Icon name="wallet" size={24} color="#FDCB6E" />
              </View>
              <Text style={styles.metricValue}>
                {formatCurrency(adminData.credits.revenue)}
              </Text>
              <Text style={styles.metricLabel}>Credits Revenue</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Subscription Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription Distribution</Text>
        <Card style={styles.distributionCard}>
          <Card.Content>
            <View style={styles.distributionRow}>
              <View style={styles.distributionItem}>
                <View style={styles.distributionHeader}>
                  <View style={[styles.distributionDot, { backgroundColor: '#8899A6' }]} />
                  <Text style={styles.distributionLabel}>Free</Text>
                </View>
                <Text style={styles.distributionValue}>
                  {formatNumber(adminData.subscriptions.free)}
                </Text>
                <Text style={styles.distributionPercent}>
                  {Math.round((adminData.subscriptions.free / adminData.users.total) * 100)}%
                </Text>
              </View>

              <View style={styles.distributionItem}>
                <View style={styles.distributionHeader}>
                  <View style={[styles.distributionDot, { backgroundColor: '#6C5CE7' }]} />
                  <Text style={styles.distributionLabel}>Premium</Text>
                </View>
                <Text style={styles.distributionValue}>
                  {formatNumber(adminData.subscriptions.premium)}
                </Text>
                <Text style={styles.distributionPercent}>
                  {Math.round((adminData.subscriptions.premium / adminData.users.total) * 100)}%
                </Text>
              </View>

              <View style={styles.distributionItem}>
                <View style={styles.distributionHeader}>
                  <View style={[styles.distributionDot, { backgroundColor: '#FDCB6E' }]} />
                  <Text style={styles.distributionLabel}>Enterprise</Text>
                </View>
                <Text style={styles.distributionValue}>
                  {formatNumber(adminData.subscriptions.enterprise)}
                </Text>
                <Text style={styles.distributionPercent}>
                  {Math.round((adminData.subscriptions.enterprise / adminData.users.total) * 100)}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </>
  );

  const renderUsers = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Users</Text>
      <Card style={styles.tableCard}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>User</DataTable.Title>
            <DataTable.Title>Plan</DataTable.Title>
            <DataTable.Title numeric>Revenue</DataTable.Title>
          </DataTable.Header>

          {recentUsers.map((user) => (
            <DataTable.Row key={user.id}>
              <DataTable.Cell>
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userDate}>
                    {formatDateTime(user.signupDate)}
                  </Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell>
                <Chip
                  style={[styles.planChip, {
                    backgroundColor: getPlanColor(user.plan) + '20',
                    borderColor: getPlanColor(user.plan),
                  }]}
                  textStyle={[styles.planText, { color: getPlanColor(user.plan) }]}
                >
                  {user.plan}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.revenueText}>
                  {formatCurrency(user.revenue)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <Card style={styles.tableCard}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title>User</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
          </DataTable.Header>

          {transactions.map((txn) => (
            <DataTable.Row key={txn.id}>
              <DataTable.Cell>
                <View style={styles.txnType}>
                  <Icon
                    name={txn.type === 'subscription' ? 'repeat' : 'wallet'}
                    size={16}
                    color="#6C5CE7"
                  />
                  <Text style={styles.txnTypeText}>{txn.type}</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.txnUser}>{txn.user}</Text>
                <Text style={styles.txnDate}>
                  {formatDateTime(txn.date)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Chip
                  style={[styles.statusChip, {
                    backgroundColor: getStatusColor(txn.status) + '20',
                    borderColor: getStatusColor(txn.status),
                  }]}
                  textStyle={[styles.statusText, { color: getStatusColor(txn.status) }]}
                >
                  {txn.status}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.txnAmount}>
                  {formatCurrency(txn.amount)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>
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
      {/* Time Range Selector */}
      <View style={styles.header}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'transactions' && renderTransactions()}
      </ScrollView>
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
  header: {
    padding: 15,
    paddingBottom: 10,
  },
  segmentedButtons: {
    backgroundColor: '#16213e',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 14,
    color: '#8899A6',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6C5CE7',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    backgroundColor: '#16213e',
    width: (width - 40) / 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#8899A6',
    marginBottom: 5,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  distributionCard: {
    backgroundColor: '#16213e',
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  distributionItem: {
    alignItems: 'center',
  },
  distributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distributionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  distributionLabel: {
    fontSize: 13,
    color: '#8899A6',
  },
  distributionValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  distributionPercent: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  tableCard: {
    backgroundColor: '#16213e',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  userEmail: {
    fontSize: 12,
    color: '#8899A6',
  },
  userDate: {
    fontSize: 11,
    color: '#657786',
  },
  planChip: {
    borderWidth: 1,
  },
  planText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  revenueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00B894',
  },
  txnType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txnTypeText: {
    fontSize: 13,
    color: '#fff',
    textTransform: 'capitalize',
  },
  txnUser: {
    fontSize: 13,
    color: '#fff',
  },
  txnDate: {
    fontSize: 11,
    color: '#8899A6',
  },
  statusChip: {
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AdminDashboardScreen;