import { Colors } from "@/constants/Colors";
import { ButtonProps, Pressable, Text, useColorScheme } from "react-native";

type ThemedButtonProps = ButtonProps & {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  type?: "primary" | "secondary";
  fullWidth?: boolean;
};

export default function ThemedButton({
  type = "primary",
  variant = "contained",
  size = "large",
  fullWidth = false,
  ...rest
}: ThemedButtonProps) {
  const colorScheme = useColorScheme();

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
        backgroundColor:
          type === "primary" ? Colors[colorScheme ?? "light"].main : "white",
        paddingHorizontal: size === "small" ? 12 : size === "medium" ? 12 : 16,
        paddingVertical: size === "small" ? 4 : size === "medium" ? 6 : 16,
        width: fullWidth ? "100%" : "auto",
      }}
    >
      <Text
        style={{
          color:
            type === "primary"
              ? "white"
              : Colors[colorScheme ?? "light"].inheritText,
          fontFamily: "Exo_600SemiBold",
          fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
        }}
      >
        {rest.title}
      </Text>
    </Pressable>
  );
}
