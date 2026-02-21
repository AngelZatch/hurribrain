import { View } from "react-native";
import ThemedText from "./ui/ThemedText";

type PlayerRankingProps = {
  score: number;
};

export default function PlayerScoreDisplay({ score }: PlayerRankingProps) {
  return (
    <View
      style={{
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "baseline",
        gap: 0,
      }}
    >
      <ThemedText
        style={{
          fontFamily: "Exo_700Bold",
          fontSize: 16,
          letterSpacing: 1.2,
        }}
      >
        {score}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          fontFamily: "Exo_400Regular",
          letterSpacing: 1.2,
        }}
      >
        {"pts"}
      </ThemedText>
    </View>
  );
}
