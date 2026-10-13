import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ICON_ASSET = require('../assets/logo/lazyeye_icon.png');
const HEADER_ASSET = require('../assets/logo/lazyeye_header_logo.png');

const SIZES = {
  xs: 24,
  sm: 36,
  md: 48,
  lg: 64,
  xl: 96,
  hero: 128,
};

export default function BrandLogo({
  size = 'md',
  variant = 'icon', // 'icon' | 'header'
  style,
  resizeMode = 'contain',
}) {
  const dimension = typeof size === 'number' ? size : (SIZES[size] || SIZES.md);

  if (variant === 'header') {
    // Aspect ratio 4:1 (480x120)
    const height = dimension;
    const width = dimension * 4;
    return (
      <View style={[styles.container, style]}>
        <Image
          source={HEADER_ASSET}
          style={{ width, height }}
          resizeMode={resizeMode}
          accessible={true}
          accessibilityLabel="LazyEye Vision Therapy"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={ICON_ASSET}
        style={{ width: dimension, height: dimension }}
        resizeMode={resizeMode}
        accessible={true}
        accessibilityLabel="LazyEye Logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

