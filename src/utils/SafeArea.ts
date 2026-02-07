import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * Safe Area and Status/Navigation Bar utilities for Android/iOS
 */

// Status bar height (approximate for mobile)
export const STATUS_BAR_HEIGHT = 44;
export const NAV_BAR_HEIGHT = 34;

/**
 * Set status bar style based on theme
 */
export const setStatusBarStyle = async (isDark: boolean) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
        await StatusBar.setStyle({
            style: isDark ? Style.Dark : Style.Light
        });

        // Set background color to match theme
        await StatusBar.setBackgroundColor({
            color: isDark ? '#0A0E1A' : '#F8FAFC'
        });
    } catch (error) {
        console.log('StatusBar not available:', error);
    }
};

/**
 * Set overlay mode for status bar (content goes behind it)
 */
export const setStatusBarOverlay = async (overlay: boolean) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
        await StatusBar.setOverlaysWebView({ overlay });
    } catch (error) {
        console.log('StatusBar overlay not available:', error);
    }
};

/**
 * Get safe area insets for current device
 */
export const getSafeAreaInsets = () => {
    if (!Capacitor.isNativePlatform()) {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    // For Android with translucent bars, use approximate values
    // iOS handles this through CSS env() variables
    return {
        top: STATUS_BAR_HEIGHT,
        bottom: NAV_BAR_HEIGHT,
        left: 0,
        right: 0
    };
};

/**
 * Initialize safe area settings on app start
 */
export const initializeSafeArea = async (isDark: boolean) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
        // Don't overlay - let content start below status bar
        await setStatusBarOverlay(false);

        // Set initial style
        await setStatusBarStyle(isDark);

        // Show status bar
        await StatusBar.show();
    } catch (error) {
        console.log('SafeArea initialization error:', error);
    }
};
