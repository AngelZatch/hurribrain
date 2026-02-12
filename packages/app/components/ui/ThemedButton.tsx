import { Colors } from "@/constants/Colors";
import {
  ButtonProps,
  ColorValue,
  Pressable,
  Text,
  useColorScheme,
} from "react-native";
import { IconSymbol, IconSymbolName } from "./IconSymbol";

type ThemedButtonProps = ButtonProps & {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  type?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  icon?: IconSymbolName;
};

type ColorMapKey =
  `${NonNullable<ThemedButtonProps["type"]>}:${NonNullable<ThemedButtonProps["variant"]>}`;

type ColorMap = {
  [key in ColorMapKey]: string;
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
    "primary:contained":
      "linear-gradient(to bottom, rgba(9, 103, 255, 1) 0%,rgba(10, 153, 255, 1) 90%)",
    "primary:outlined": "transparent",
    "primary:text": "transparent",
    "secondary:contained":
      "linear-gradient(to bottom, rgba(233, 233, 233, 1) 0%,rgba(255, 255, 255, 1) 90%)",
    "secondary:outlined": "transparent",
    "secondary:text": "transparent",
    "danger:contained":
      "linear-gradient(to bottom, rgba(211, 111, 111, 1) 0%,rgba(242, 71, 71, 1) 90%)",
    "danger:outlined": "transparent",
    "danger:text": "transparent",
  };

  const borderColorMap: Partial<ColorMap> = {
    "primary:contained":
      "linear-gradient(to bottom, rgba(62, 105, 209, 1) 0%,rgba(83, 198, 245, 1) 100%)",
    "danger:contained":
      "border-color: linear-gradient(to bottom, rgba(182, 51, 51, 1) 0%,rgba(249, 70, 70, 1) 100%)",
    "secondary:contained":
      "border-color: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%,rgba(160, 160, 160, 1) 100%)",
  };

  const textColorMap: Partial<ColorMap> = {
    "primary:contained": "white",
    "primary:outlined": Colors[colorScheme ?? "light"].main,
    "primary:text": Colors[colorScheme ?? "light"].main,
    "danger:contained": "white",
    "danger:outlined": Colors[colorScheme ?? "light"].error,
    "danger:text": Colors[colorScheme ?? "light"].error,
    "secondary:contained": Colors[colorScheme ?? "light"].inheritText,
    "secondary:outlined": Colors[colorScheme ?? "light"].inheritText,
    "secondary:text": Colors[colorScheme ?? "light"].inheritText,
  };

  return (
    <Pressable
      style={{
        display: "flex",
        minHeight: 48,
        maxHeight: 48,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        borderRadius: 24,
        paddingHorizontal: rest.title ? 12 : 8,
        paddingVertical: rest.title ? 16 : 8,
        width: fullWidth ? "100%" : "auto",
        flex: fullWidth ? 1 : undefined,
        backgroundImage: backgroundColorMap[`${type}:${variant}`],
        borderColor: borderColorMap[`${type}:${variant}`],
        borderWidth: 1,
        opacity: rest.disabled ? 0.4 : 1,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
      }}
      onPress={rest.onPress}
    >
      {rest.icon && (
        <IconSymbol
          color={textColorMap[`${type}:${variant}`] as ColorValue}
          size={32}
          name={rest.icon}
        />
      )}
      {rest.title && (
        <Text
          style={{
            color: textColorMap[`${type}:${variant}`],
            fontFamily: "Exo_600SemiBold",
            fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
          }}
        >
          {rest.title}
        </Text>
      )}
    </Pressable>
  );
}
