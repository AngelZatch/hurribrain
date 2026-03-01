import { Pressable, View } from "react-native";
import { IconSymbol, IconSymbolName } from "./IconSymbol";
import ThemedText from "./ThemedText";

type SettingsOptionsProps = {
  icon: IconSymbolName;
  label: string;
  toNextPage?: boolean;
  onClick: () => void;
};

export default function SettingsOption({
  icon,
  label,
  toNextPage = true,
  onClick,
}: SettingsOptionsProps) {
  return (
    <Pressable onPress={onClick}>
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          paddingVertical: 8,
          paddingHorizontal: 4,
        }}
      >
        <IconSymbol name={icon} />
        <ThemedText
          style={{
            fontSize: 14,
            fontFamily: "Exo_600SemiBold",
            width: "100%",
          }}
        >
          {label}
        </ThemedText>
        {toNextPage && <IconSymbol name="chevron.right" />}
      </View>
    </Pressable>
  );
}
