import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Item } from "@/api/play.api";

type StatusTimerProps = {
  name: string;
  duration: number;
};

export default function StatusTimer({ name, duration }: StatusTimerProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: "#2F2F2F",
      }}
    >
      <ThemedText
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: "Exo_400Regular",
          color: "#FFFFFF",
        }}
      >
        {name} ({duration})
      </ThemedText>
    </View>
  );
}
