import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useState } from "react";

type PlayerScoreDisplayProps = {
  score: number;
};
export default function PlayerScoreDisplay({ score }: PlayerScoreDisplayProps) {
  const [displayedScore, setDisplayedScore] = useState(score);

  // Score change animation
  useEffect(() => {
    if (displayedScore === score) return;

    const timerId = setInterval(() => {
      setDisplayedScore((previousScore) => {
        if (previousScore < score) return previousScore + 1;
        if (previousScore > score) return previousScore - 1;
        return previousScore;
      });
    }, 50);

    return () => clearInterval(timerId);
  }, [score]);

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
          textShadowColor: "#00000033",
          textShadowOffset: {
            height: 2,
            width: -2,
          },
          textShadowRadius: 3,
        }}
      >
        {displayedScore}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          fontFamily: "Exo_400Regular",
          letterSpacing: 1.2,
          textShadowColor: "#00000033",
          textShadowOffset: {
            height: 2,
            width: -2,
          },
          textShadowRadius: 3,
        }}
      >
        {"pts"}
      </ThemedText>
    </View>
  );
}
