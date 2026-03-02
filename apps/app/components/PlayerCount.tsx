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
        paddingVertical: 4,
        paddingRight: 8,
        paddingLeft: 12,
        gap: 6,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 9999,
        backgroundColor: "#0000000A",
      }}
    >
      <View
        style={{
          display: "flex",
          gap: 0,
          flexDirection: "row",
        }}
      >
        <ThemedText style={{ fontSize: 14, fontFamily: "Exo_800ExtraBold" }}>
          {count}
        </ThemedText>
        <ThemedText
          style={{ fontSize: 10, color: "#5e74a9" }}
        >{`/12`}</ThemedText>
      </View>
      <IconSymbol name="person.fill" size={24} />
    </View>
  );
}
