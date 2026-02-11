import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import WorkflowBuilderScreen from '../screens/WorkflowBuilderScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import MonitorScreen from '../screens/MonitorScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const WorkflowStack = () => {
  return (
    <Stack.Navigator
      screenOptions={
        headerStyle: {
          backgroundColor: '#16213e',
        },
        headerTintColor: '#fff',
      }
    >
      <Stack.Screen 
        name="WorkflowList" 
        component={HomeScreen}
        options={{ title: 'Workflows' }}
      />
      <Stack.Screen 
        name="WorkflowBuilder" 
        component={WorkflowBuilderScreen}
        options={{ title: 'Workflow Builder' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Workflows') {
              iconName = focused ? 'graph' : 'graph-outline';
            } else if (route.name === 'Templates') {
              iconName = focused ? 'file-document' : 'file-document-outline';
            } else if (route.name === 'Monitor') {
              iconName = focused ? 'monitor-dashboard' : 'monitor';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6C5CE7',
          tabBarInactiveTintColor: '#8899A6',
          tabBarStyle: {
            backgroundColor: '#16213e',
            borderTopColor: '#0f3460',
          },
          headerStyle: {
            backgroundColor: '#16213e',
          },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen 
          name="Workflows" 
          component={WorkflowStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Templates" component={TemplatesScreen} />
        <Tab.Screen name="Monitor" component={MonitorScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
