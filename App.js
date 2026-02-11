import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { useWorkflowStore } from './src/store/workflowStore';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6C5CE7',
    secondary: '#00B894',
    background: '#1a1a2e',
    surface: '#16213e',
    error: '#FF6B6B',
  },
};

export default function App() {
  const loadWorkflows = useWorkflowStore((state) => state.loadWorkflows);

  useEffect(() => {
    // Load persisted workflows on app start
    loadWorkflows();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
