import { Colors } from "@/constants/Colors";
import {
  ButtonProps,
  ColorValue,
  Pressable,
  Text,
  useColorScheme,
} from "react-native";

type ThemedButtonProps = ButtonProps & {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  type?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
};

type ColorMapKey =
  `${NonNullable<ThemedButtonProps["type"]>}:${NonNullable<ThemedButtonProps["variant"]>}:${ButtonProps["disabled"]}`;

type ColorMap = {
  [key in ColorMapKey]: ColorValue;
};

export default function ThemedButton({
  type = "primary",
  variant = "contained",
  size = "large",
  fullWidth = false,
  ...rest
}: ThemedButtonProps) {
  const colorScheme = useColorScheme();

  const backgroundColorMap: Partial<ColorMap> = {
    "primary:contained:false": Colors[colorScheme ?? "light"].main,
    "primary:contained:true": Colors[colorScheme ?? "light"].disabledBackground,
    "primary:outlined:false": "transparent",
    "primary:text:false": "transparent",
    "secondary:contained:false": "white",
    "secondary:outlined:false": "transparent",
    "secondary:text:false": "transparent",
    "danger:contained:false": Colors[colorScheme ?? "light"].error,
    "danger:outlined:false": "transparent",
    "danger:text:false": "transparent",
  };

  const textColorMap: Partial<ColorMap> = {
    "primary:contained:false": "white",
    "primary:contained:true":
      Colors[colorScheme ?? "light"].inheritDisabledTextColor,
    "primary:outlined:false": Colors[colorScheme ?? "light"].main,
    "primary:text:false": Colors[colorScheme ?? "light"].main,
    "danger:contained:false": "white",
    "danger:outlined:false": Colors[colorScheme ?? "light"].error,
    "danger:text:false": Colors[colorScheme ?? "light"].error,
    "secondary:contained:false": Colors[colorScheme ?? "light"].inheritText,
    "secondary:outlined:false": Colors[colorScheme ?? "light"].inheritText,
    "secondary:text:false": Colors[colorScheme ?? "light"].inheritText,
  };

  return (
    <Pressable
      style={{
        display: "flex",
        minWidth: 120,
        minHeight: 56,
        maxHeight: 56,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
        paddingHorizontal: size === "small" ? 12 : size === "medium" ? 12 : 16,
        paddingVertical: size === "small" ? 4 : size === "medium" ? 6 : 16,
        width: fullWidth ? "100%" : "auto",
        backgroundColor:
          backgroundColorMap[`${type}:${variant}:${!!rest.disabled}`],
      }}
      onPress={rest.onPress}
    >
      <Text
        style={{
          color: textColorMap[`${type}:${variant}:${!!rest.disabled}`],
          fontFamily: "Exo_600SemiBold",
          fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
        }}
      >
        {rest.title}
      </Text>
    </Pressable>
  );
}
