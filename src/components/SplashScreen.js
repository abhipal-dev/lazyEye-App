import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import BrandLogo from './BrandLogo';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen({ backgroundColor }) {
  const { theme } = useTheme();
  const bg = backgroundColor || theme?.colors?.background || '#0F172A';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={theme?.statusBar || 'light-content'}
        backgroundColor={bg}
      />
      <BrandLogo size={120} variant="icon" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

