/**
 * TabScreenHelper - Utility functions for tab screen content padding
 * Handles Android 15 edge-to-edge display and tab bar spacing
 */

import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Get content container style for tab screens
 * Ensures proper spacing above tab bar
 */
export const getTabScreenContentStyle = (insets) => {
  return {
    paddingBottom: Platform.OS === 'android' ? 100 + insets.bottom : 100,
    flexGrow: 1,
  };
};

/**
 * Get tab bar style for consistent appearance
 */
export const getTabBarStyle = (insets) => {
  return {
    height: 70 + insets.bottom,
    paddingBottom: insets.bottom,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  };
};

/**
 * Get tab label style for consistent text appearance
 */
export const getTabLabelStyle = () => {
  return {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  };
};

/**
 * Hook for tab screen content padding
 * Usage: const contentStyle = useTabScreenContentStyle();
 */
export const useTabScreenContentStyle = () => {
  const insets = useSafeAreaInsets();
  return getTabScreenContentStyle(insets);
};

/**
 * Hook for tab bar styling
 * Usage: const tabBarStyle = useTabBarStyle();
 */
export const useTabBarStyle = () => {
  const insets = useSafeAreaInsets();
  return getTabBarStyle(insets);
};

/**
 * Hook for tab label styling
 * Usage: const tabLabelStyle = useTabLabelStyle();
 */
export const useTabLabelStyle = () => {
  return getTabLabelStyle();
};
