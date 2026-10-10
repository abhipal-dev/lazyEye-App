import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

function MainApp() {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.statusBar || 'light-content'}
        backgroundColor={theme.colors.surface}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <RootNavigator />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
