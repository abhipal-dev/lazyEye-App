import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import CustomIcon from './CustomIcon';
import LoadingScreen from './LoadingScreen';
import { useTheme } from '../context/ThemeContext';

export default function GameWebView({
  title = 'Therapy Game',
  source,
  onClose,
  leftColor = '#EF4444',
  rightColor = '#0284C7',
  onMessage,
}) {
  const { theme, useWebGames } = useTheme();
  const webViewRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Detect whether this is a live web URL or local HTML engine
  const resolvedSource = typeof source === 'string'
    ? { uri: source }
    : (source || { html: '<h1>No Game Source Provided</h1>' });
  const isWebUrl = Boolean(resolvedSource?.uri);

  // Handle hardware / gesture back on Android
  useEffect(() => {
    const onBackPress = () => {
      if (onClose) {
        onClose();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [onClose]);

  // Handle retry
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

  return (
    <View style={[styles.root, { backgroundColor: '#090D1A' }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F172A"
        translucent={true}
      />

      {/* Clean Top Navigation Bar with Status Bar Notch Inset */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topInset + 6,
            backgroundColor: '#0F172A',
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          },
        ]}
      >
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.exitBtn}
          accessible={true}
          accessibilityLabel="Exit game and return to dashboard"
        >
          <CustomIcon
            library="Feather"
            name="arrow-left"
            size={16}
            color="#F8FAFC"
          />
          <Text style={styles.exitBtnText}>Exit</Text>
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.lensBadge}>
          <View style={[styles.lensDot, { backgroundColor: leftColor }]} />
          <Text style={styles.lensText}>OS</Text>
          <Text style={styles.dotDivider}>•</Text>
          <View style={[styles.lensDot, { backgroundColor: rightColor }]} />
          <Text style={styles.lensText}>OD</Text>
          {isWebUrl && (
            <>
              <Text style={styles.dotDivider}>•</Text>
              <View style={styles.webLivePill}>
                <View style={styles.liveDot} />
                <Text style={styles.webLiveText}>LIVE</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Main WebView Viewport Area: 100% Maximized Safe Space */}
      <View style={styles.webContainer}>
          {hasError ? (
            <View
              style={[
                styles.errorCard,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.errorIconWrap,
                  {
                    backgroundColor: `${theme.colors.danger}18`,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <CustomIcon
                  library="Feather"
                  name="alert-triangle"
                  size={32}
                  color={theme.colors.danger}
                />
              </View>
              <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
                Unable to load game
              </Text>
              <Text style={[styles.errorSubtitle, { color: theme.colors.textSecondary }]}>
                {errorMessage || 'The therapy session could not connect. Please check your network connection or try reloading.'}
              </Text>

              <View style={styles.errorBtnRow}>
                <TouchableOpacity
                  onPress={handleRetry}
                  style={[
                    styles.retryButton,
                    {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.buttonBorder,
                    },
                  ]}
                >
                  <CustomIcon
                    library="Feather"
                    name="refresh-cw"
                    size={16}
                    color={theme.colors.textInverted}
                  />
                  <Text
                    style={[
                      styles.retryButtonText,
                      { color: theme.colors.textInverted },
                    ]}
                  >
                    Try Again
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.exitButton,
                    {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.buttonBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exitButtonText,
                      { color: theme.colors.text },
                    ]}
                  >
                    Exit to Home
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <WebView
              ref={webViewRef}
              source={resolvedSource}
              style={styles.webView}
              scrollEnabled={isWebUrl}
              bounces={false}
              overScrollMode="never"
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              originWhitelist={['*']}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                setHasError(true);
                setIsLoading(false);
                setErrorMessage(nativeEvent.description || 'Failed to load therapy resource');
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                setHasError(true);
                setIsLoading(false);
                setErrorMessage(`Server error (${nativeEvent.statusCode})`);
              }}
              onMessage={(event) => {
                try {
                  if (onMessage) onMessage(event.nativeEvent.data);
                } catch (e) {
                  // Ignore parsing errors
                }
              }}
            />
          )}

          {isLoading && !hasError && (
            <View style={StyleSheet.absoluteFill}>
              <LoadingScreen
                message={
                  isWebUrl
                    ? 'Connecting to LazyEye Live Web Portal...'
                    : 'Calibrating dichoptic display...'
                }
              />
            </View>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#090D1A',
  },
  topBar: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  exitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  lensBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  lensDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lensText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  dotDivider: {
    fontSize: 10,
    color: '#64748B',
  },
  webLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  webLiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webView: {
    flex: 1,
    backgroundColor: '#090D1A',
  },
  errorCard: {
    margin: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 380,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  errorIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
  },
  exitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
