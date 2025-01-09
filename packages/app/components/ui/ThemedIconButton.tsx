import { ButtonProps, Pressable, useColorScheme } from "react-native";
import { IconSymbol, IconSymbolName } from "./IconSymbol";
import { Colors } from "@/constants/Colors";

type ThemedIconButtonProps = Omit<ButtonProps, "title"> & {
  icon: IconSymbolName;
};

export default function ThemedIconButton({
  icon,
  ...rest
}: ThemedIconButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      style={{
        display: "flex",
        minWidth: 40,
        minHeight: 40,
        maxWidth: 40,
        maxHeight: 40,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 9999,
        backgroundColor: "#0000000A",
      }}
      onPress={rest.onPress}
    >
      <IconSymbol
        color={Colors[colorScheme ?? "light"].text}
        size={32}
        name={icon}
      />
    </Pressable>
  );
}
