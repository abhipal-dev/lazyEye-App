import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import CustomIcon from './CustomIcon';
import { useTheme } from '../context/ThemeContext';

const BAR_HEIGHT = 64;
const PILL_HEIGHT = 48;
const PILL_MARGIN = 4;
const BAR_MARGIN_H = 16;
const SCREEN_WIDTH = Dimensions.get('window').width;
const INITIAL_INNER_WIDTH = Math.max(0, SCREEN_WIDTH - BAR_MARGIN_H * 2);

/**
 * Individual Tab Bar Item with Tactile Micro-Interactions:
 * - pressScale: tactile jelly squish on finger touch-down
 * - bounceAnim: springy bubble pop on selection or re-tap
 * - dotAnim: jewel micro-dot indicator below label
 */
const TabBarItem = memo(function TabBarItem({
  tabKey,
  focused,
  iconConfig,
  label,
  tintColor,
  accentColor,
  onPress,
  onPressIn,
  onPressOut,
  pressAnim,
  bounceAnim,
  dotAnim,
}) {
  const combinedScale = Animated.multiply(pressAnim, bounceAnim);

  return (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <View style={styles.tabItem}>
        <Animated.View
          style={[
            styles.itemInner,
            {
              transform: [{ scale: combinedScale }],
            },
          ]}
        >
          <CustomIcon
            library={iconConfig.library}
            name={focused ? iconConfig.activeName : iconConfig.name}
            size={20}
            color={tintColor}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              {
                color: tintColor,
                fontWeight: focused ? '700' : '500',
              },
            ]}
          >
            {label}
          </Text>

          {/* Micro-Dot Indicator */}
          <Animated.View
            style={[
              styles.activeDotContainer,
              {
                transform: [{ scale: dotAnim }],
                opacity: dotAnim,
              },
            ]}
          >
            <View style={[styles.activeDot, { backgroundColor: accentColor }]} />
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default function BottomTabBar({
  tabs = [
    { key: 'Overview', label: 'Overview', library: 'Feather', name: 'home', activeName: 'home' },
    { key: 'Games', label: 'Games', library: 'MaterialCommunityIcons', name: 'gamepad-variant-outline', activeName: 'gamepad-variant' },
    { key: 'Activity', label: 'Activity', library: 'Feather', name: 'activity', activeName: 'activity' },
    { key: 'Profile', label: 'Profile', library: 'Feather', name: 'user', activeName: 'user' },
  ],
  activeTab = 'Overview',
  onTabPress,
}) {
  const { theme } = useTheme();
  const [innerWidth, setInnerWidth] = useState(INITIAL_INNER_WIDTH);

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.key === activeTab));
  const tabWidth = innerWidth > 0 ? innerWidth / tabs.length : 0;
  const pillWidth = Math.max(0, tabWidth - PILL_MARGIN * 2);

  // Sliding & 2D squash/stretch physics
  const translateX = useRef(new Animated.Value(activeIndex * tabWidth + PILL_MARGIN)).current;
  const pillScaleX = useRef(new Animated.Value(1)).current;
  const pillScaleY = useRef(new Animated.Value(1)).current;

  // Per-tab animation drivers
  const pressAnims = useRef(tabs.map(() => new Animated.Value(1))).current;
  const bounceAnims = useRef(tabs.map(() => new Animated.Value(1))).current;
  const dotAnims = useRef(tabs.map((_, i) => new Animated.Value(i === activeIndex ? 1 : 0))).current;

  useEffect(() => {
    if (!tabWidth || innerWidth <= 0) return;

    const targetX = activeIndex * tabWidth + PILL_MARGIN;

    // 1. Sliding spring with fluid Apple-like physics
    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: true,
      damping: 18,
      stiffness: 220,
      mass: 0.75,
    }).start();

    // 2. Squash & stretch during slide
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pillScaleX, { toValue: 1.12, duration: 80, useNativeDriver: true }),
        Animated.timing(pillScaleY, { toValue: 0.90, duration: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pillScaleX, { toValue: 1, friction: 5, tension: 180, useNativeDriver: true }),
        Animated.spring(pillScaleY, { toValue: 1, friction: 5, tension: 180, useNativeDriver: true }),
      ]),
    ]).start();

    // 3. Dot expansion
    tabs.forEach((_, i) => {
      const isTarget = i === activeIndex;
      Animated.spring(dotAnims[i], {
        toValue: isTarget ? 1 : 0,
        friction: 5,
        tension: 220,
        useNativeDriver: true,
      }).start();
    });

    // 4. Elastic icon bounce pop on activation
    const activeBounce = bounceAnims[activeIndex];
    if (activeBounce) {
      activeBounce.setValue(0.82);
      Animated.spring(activeBounce, {
        toValue: 1,
        friction: 4,
        tension: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [activeIndex, tabWidth, innerWidth, tabs, bounceAnims, dotAnims]);

  const handlePressIn = useCallback((idx) => {
    Animated.spring(pressAnims[idx], {
      toValue: 0.88,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [pressAnims]);

  const handlePressOut = useCallback((idx) => {
    Animated.spring(pressAnims[idx], {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [pressAnims]);

  const handlePress = useCallback(
    (tab, idx) => {
      const isFocused = activeIndex === idx;

      if (isFocused) {
        // Re-tap on current tab: playful bounce wobble
        const bounce = bounceAnims[idx];
        if (bounce) {
          Animated.sequence([
            Animated.timing(bounce, { toValue: 1.18, duration: 70, useNativeDriver: true }),
            Animated.spring(bounce, { toValue: 1, friction: 4, tension: 240, useNativeDriver: true }),
          ]).start();
        }
        return;
      }

      if (onTabPress) {
        onTabPress(tab.key);
      }
    },
    [activeIndex, bounceAnims, onTabPress]
  );

  const activeAccent = theme.colors.primary;
  const inactiveColor = theme.colors.textMuted || '#8E8E93';
  const barBg = theme.colors.cardBg || theme.colors.surface;
  const pillBg = theme.colors.iconContainerBg || theme.colors.surfaceHighlight;

  return (
    <View
      style={[
        styles.outer,
        {
          backgroundColor: barBg,
          borderColor: theme.colors.cardBorder || theme.colors.border,
          shadowColor: '#000',
        },
      ]}
    >
      <View
        style={styles.inner}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - innerWidth) > 1) {
            setInnerWidth(w);
          }
        }}
      >
        {/* Sliding Rounded Pill Indicator */}
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pill,
              {
                width: pillWidth,
                backgroundColor: pillBg,
                borderColor: theme.colors.primaryLight || 'rgba(0,0,0,0.06)',
                transform: [
                  { translateX },
                  { scaleX: pillScaleX },
                  { scaleY: pillScaleY },
                ],
              },
            ]}
          />
        )}

        {/* Tab Items */}
        {tabs.map((tab, idx) => {
          const focused = activeIndex === idx;
          const tintColor = focused ? activeAccent : inactiveColor;

          return (
            <TabBarItem
              key={tab.key}
              tabKey={tab.key}
              focused={focused}
              iconConfig={tab}
              label={tab.label}
              tintColor={tintColor}
              accentColor={activeAccent}
              pressAnim={pressAnims[idx]}
              bounceAnim={bounceAnims[idx]}
              dotAnim={dotAnims[idx]}
              onPress={() => handlePress(tab, idx)}
              onPressIn={() => handlePressIn(idx)}
              onPressOut={() => handlePressOut(idx)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: BAR_MARGIN_H,
    right: BAR_MARGIN_H,
    bottom: Platform.OS === 'ios' ? 14 : 12,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: 1,
    elevation: 12,
    zIndex: 999,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    height: PILL_HEIGHT,
    top: (BAR_HEIGHT - PILL_HEIGHT) / 2,
    borderRadius: PILL_HEIGHT / 2,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  activeDotContainer: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
});

