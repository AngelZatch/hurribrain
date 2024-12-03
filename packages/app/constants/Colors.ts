/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const tintColorLight = '#0A99FF';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: 'transparent',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    backgroundGradient: "linear-gradient(#3C73FF, #BFEAEC)"
  },
  dark: {
    text: '#fff',
    background: 'transparent',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    backgroundGradient: "linear-gradient(#1C2727, #466263)"
  },
};

export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent"
  }
}
export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "transparent"
  }
}