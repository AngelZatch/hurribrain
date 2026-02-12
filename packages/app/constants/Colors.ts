/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const tintColorLight = '#0A99FF';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    main: "#0A99FF",
    text: '#0F2969',
    inheritText: '#0F2969',
    background: 'transparent',
    disabledBackground: "#BDBDBD",
    error: "#D36F6F",
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    backgroundGradient: "linear-gradient(#3C73FF, #BFEAEC)",
    containerBackground: "#00000033",
    secondaryText: "#0F2969",
    disabled: "#5F5F5F",
    inheritDisabledTextColor: "#5F5F5F",
    fadedWhite: "#00000066"

  },
  dark: {
    main: "#0A99FF",
    text: '#fff',
    inheritText: '#0F2969',
    background: 'transparent',
    disabledBackground: "#BDBDBD",
    error: "#D36F6F",
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    backgroundGradient: "linear-gradient(#201C27, #063E7F)",
    containerBackground: "#ffffff33",
    secondaryText: "#FFFFFF",
    disabled: "#C6C6C6",
    inheritDisabledTextColor: "#5F5F5F",
    fadedWhite: "#FFFFFF66"
  },
};

export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
    main: "#0A99FF",
  }
}
export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "transparent",
    main: "#0A99FF",
  }
}