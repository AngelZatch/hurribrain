import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

type PlayerCountProps = {
  count: number;
};

export default function PlayerCount({ count }: PlayerCountProps) {
  return (
    <View
      style={{
        display: "flex",
        padding: 8,
        gap: 6,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <ThemedText style={{ fontSize: 18 }}>{count}</ThemedText>
      <IconSymbol name="person.fill" size={24} />
    </View>
  );
}
