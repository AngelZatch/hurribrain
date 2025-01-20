import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

export default function ActiveTurnTimer() {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 0,
        borderRadius: 10,
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        flexGrow: 0,
        flexShrink: 1,
        height: 25,
        maxWidth: 92,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <IconSymbol
        name="hourglass"
        size={24}
        style={{
          backgroundImage: "linear-gradient(#3C73FF, #3AF2F8)",
          color: "transparent",
          backgroundClip: "text",
        }}
      />
      <ThemedText
        style={{
          fontFamily: "Exo_600SemiBold",
          fontSize: 20,
          backgroundImage: "linear-gradient(#3C73FF, #3AF2F8)",
          color: "transparent",
          backgroundClip: "text",
        }}
      >
        0:15
      </ThemedText>
    </View>
  );
}
