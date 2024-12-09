import { Colors } from "@/constants/Colors";
import { ButtonProps, Pressable, Text, useColorScheme } from "react-native";

export type ThemedButtonProps = ButtonProps & {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  type?: "primary" | "secondary";
};

export function ThemedButton({
  type = "primary",
  variant = "contained",
  size = "large",
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
          type === "primary" ? Colors[colorScheme ?? "light"].main : "green",
        paddingHorizontal: size === "small" ? 12 : size === "medium" ? 12 : 16,
        paddingVertical: size === "small" ? 4 : size === "medium" ? 6 : 16,
      }}
    >
      <Text style={{ color: "white" }}>{rest.title}</Text>
    </Pressable>
  );
}
