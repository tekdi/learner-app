import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Default edges: Android includes `bottom` so content does not draw under the
 * system navigation bar on Android 15+ edge-to-edge. iOS keeps bottom off by default
 * so tab bars / home indicator handling in navigators is not doubled; use
 * `includeBottom` when needed on iOS.
 */
const DEFAULT_EDGES_ANDROID = ['top', 'left', 'right', 'bottom'];
const DEFAULT_EDGES_IOS = ['top', 'left', 'right'];

/**
 * SafeAreaWrapper - A reusable component for consistent SafeAreaView usage
 * Handles Android 15 edge-to-edge display issues by properly configuring safe areas
 *
 * @param {Object} props - Component props
 * @param {Array} props.edges - Array of edges to apply safe area (platform defaults if omitted)
 * @param {Object} props.style - Additional styles to apply
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.excludeTop - Exclude top safe area (useful for screens with custom headers)
 * @param {boolean} props.excludeBottom - Exclude bottom safe area (e.g. tab screens where the tab bar owns bottom inset)
 * @param {boolean} props.includeBottom - Add bottom safe area when not already present (useful on iOS for standalone screens)
 */
const SafeAreaWrapper = ({
  edges = Platform.OS === 'android' ? DEFAULT_EDGES_ANDROID : DEFAULT_EDGES_IOS,
  style = {},
  children,
  excludeTop = false,
  excludeBottom = false,
  includeBottom = false,
  ...props
}) => {
  // Handle edge exclusions and inclusions
  let finalEdges = [...edges];

  if (excludeTop) {
    finalEdges = finalEdges.filter((edge) => edge !== 'top');
  }

  if (excludeBottom) {
    finalEdges = finalEdges.filter((edge) => edge !== 'bottom');
  }

  // Add bottom when explicitly requested (mainly for iOS default, or custom `edges` without bottom)
  if (includeBottom && !finalEdges.includes('bottom')) {
    finalEdges.push('bottom');
  }

  // For Android 15+ edge-to-edge display, ensure we handle all edges properly
  const safeAreaStyle = {
    flex: 1,
    ...style,
  };

  return (
    <SafeAreaView style={safeAreaStyle} edges={finalEdges} {...props}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
