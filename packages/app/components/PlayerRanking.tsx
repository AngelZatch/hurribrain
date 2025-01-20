import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type PlayerRankingProps = {
  player: {
    score: number;
    rank: number;
  };
};

export default function PlayerRanking({ player }: PlayerRankingProps) {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <View
      style={{
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      }}
    >
      <View
        style={{
          alignItems: "flex-end",
        }}
      >
        <ThemedText
          style={{
            fontFamily: "Exo_700Bold",
            letterSpacing: 0.7,
            color: Colors[colorScheme].fadedWhite,
          }}
        >
          Score
        </ThemedText>
        <ThemedText
          style={{
            fontFamily: "Exo_700Bold",
            fontSize: 20,
            color: Colors[colorScheme].fadedWhite,
          }}
        >
          {player.score}
        </ThemedText>
      </View>
      <View>{player.rank}</View>
    </View>
  );
}
