import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar, Text } from 'react-native';
import BrandLogo from './BrandLogo';
import { useTheme } from '../context/ThemeContext';

export default function LoadingScreen({ message, backgroundColor }) {
  const { theme } = useTheme();
  const bg = backgroundColor || theme?.colors?.background || '#0F172A';

  // Gentle Eye Blink and Soft Pulse Animation
  const blinkAnim = useRef(new Animated.Value(1)).current; // scaleY for blinking
  const pulseAnim = useRef(new Animated.Value(1)).current; // soft breathing scale

  useEffect(() => {
    // 1. Soft Breathing Pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 2. Periodic Soft Eye Blink (every ~2.5 seconds)
    let isMounted = true;
    const triggerBlink = () => {
      if (!isMounted) return;
      Animated.sequence([
        // Close eyelid
        Animated.timing(blinkAnim, {
          toValue: 0.12,
          duration: 120,
          useNativeDriver: true,
        }),
        // Reopen eyelid
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isMounted) {
          blinkTimeout = setTimeout(triggerBlink, 2600);
        }
      });
    };

    let blinkTimeout = setTimeout(triggerBlink, 1500);

    return () => {
      isMounted = false;
      pulseLoop.stop();
      clearTimeout(blinkTimeout);
    };
  }, [blinkAnim, pulseAnim]);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={theme?.statusBar || 'light-content'}
        backgroundColor={bg}
      />
      <Animated.View
        style={{
          transform: [
            { scale: pulseAnim },
            { scaleY: blinkAnim },
          ],
        }}
      >
        <BrandLogo size={104} variant="icon" />
      </Animated.View>

      {message ? (
        <Text style={[styles.message, { color: theme?.colors?.textSecondary || '#94A3B8' }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

