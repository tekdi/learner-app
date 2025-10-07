import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

/**
 * SafeAreaWrapper - A reusable component for consistent SafeAreaView usage
 * Handles Android 15 edge-to-edge display issues by properly configuring safe areas
 *
 * @param {Object} props - Component props
 * @param {Array} props.edges - Array of edges to apply safe area (default: ['top', 'left', 'right', 'bottom'])
 * @param {Object} props.style - Additional styles to apply
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.excludeTop - Exclude top safe area (useful for screens with custom headers)
 * @param {boolean} props.excludeBottom - Exclude bottom safe area (useful for screens with custom footers)
 */
const SafeAreaWrapper = ({
  edges = ['top', 'left', 'right', 'bottom'],
  style = {},
  children,
  excludeTop = false,
  excludeBottom = false,
  ...props
}) => {
  // Handle edge exclusions
  let finalEdges = [...edges];

  if (excludeTop) {
    finalEdges = finalEdges.filter((edge) => edge !== 'top');
  }

  if (excludeBottom) {
    finalEdges = finalEdges.filter((edge) => edge !== 'bottom');
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
