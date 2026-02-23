import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  colorType?: "text" | "secondaryText" | "inheritText" | "main";
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "smallTitle"
    | "label"
    | "helper"
    | "settingsSectionTitle";
};

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  colorType = "text",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType,
  );

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "smallTitle" ? styles.smallTitle : undefined,
        type === "label" ? styles.label : undefined,
        type === "helper" ? styles.helper : undefined,
        type === "settingsSectionTitle"
          ? styles.settingsSectionTitle
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Exo_400Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Exo_600SemiBold",
  },
  title: {
    fontSize: 48,
    fontFamily: "Exo_900Black",
    letterSpacing: 2.4,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Exo_500Medium",
    letterSpacing: 1,
  },
  settingsSectionTitle: {
    fontSize: 24,
    fontFamily: "Exo_600SemiBold",
  },
  smallTitle: {
    fontSize: 32,
    fontFamily: "Exo_600SemiBold",
    letterSpacing: 1.6,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  label: {
    fontSize: 14,
    fontFamily: "Exo_600SemiBold",
  },
  helper: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: "Exo_400Regular",
  },
});
