import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * SafeAreaWrapper - A reusable component for consistent SafeAreaView usage
 * Handles Android 15 edge-to-edge display issues by properly configuring safe areas
 *
 * @param {Object} props - Component props
 * @param {Array} props.edges - Array of edges to apply safe area (default: ['top', 'left', 'right'])
 * @param {Object} props.style - Additional styles to apply
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.excludeTop - Exclude top safe area (useful for screens with custom headers)
 * @param {boolean} props.includeBottom - Include bottom safe area (useful for standalone screens without tab navigation)
 */
const SafeAreaWrapper = ({
  edges = ['top', 'left', 'right'],
  style = {},
  children,
  excludeTop = false,
  includeBottom = false,
  ...props
}) => {
  // Handle edge exclusions and inclusions
  let finalEdges = [...edges];

  if (excludeTop) {
    finalEdges = finalEdges.filter((edge) => edge !== 'top');
  }

  // Include bottom edge if explicitly requested (for standalone screens)
  // By default, bottom is excluded since tab navigators handle it
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
