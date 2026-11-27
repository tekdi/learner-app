import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RNRestart from 'react-native-restart';

/**
 * Top-level error boundary.
 *
 * Without this, any error thrown while rendering a screen is fatal in release builds:
 * React Native reports it as a JavascriptException and the app closes (counted as a crash
 * in Play Console Android vitals). With it, the user sees a retry screen instead.
 *
 * Plain react-native components only: this sits outside every provider (language, theme,
 * navigation), so it must not depend on any of them.
 */
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('AppErrorBoundary caught a render error', error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleRestart = () => {
    RNRestart.restart();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          Sorry, the app ran into a problem. Please try again.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
          <Text style={styles.primaryButtonText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={this.handleRestart}>
          <Text style={styles.secondaryButtonText}>Restart app</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F1B13',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#4D4639',
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#FDBE16',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F1B13',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0D599E',
  },
});

export default AppErrorBoundary;
