/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#211509',
    background: '#F1DDB3',
    surface: '#FFF8E8',
    parchment: '#E7C889',
    input: '#FFFDF7',
    backgroundElement: '#DDBB78',
    backgroundSelected: '#A96522',
    textSecondary: '#2A1909',
    mutedText: '#4A3016',
    border: '#6D461E',
    deepGreen: '#17452F',
    brick: '#7A2C18',
    wheat: '#A86905',
    wheatSoft: '#EDC96D',
    heading: '#2B1706',
  },
  dark: {
    text: '#F7E8C5',
    background: '#201A13',
    surface: '#332719',
    parchment: '#44341F',
    input: '#2A2117',
    backgroundElement: '#3C2D1B',
    backgroundSelected: '#75522A',
    textSecondary: '#D9C294',
    mutedText: '#BDAA82',
    border: '#755D38',
    deepGreen: '#6FA083',
    brick: '#C66A4B',
    wheat: '#D9AA42',
    wheatSoft: '#725B26',
    heading: '#F7E8C5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
