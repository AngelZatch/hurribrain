import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useState } from "react";
import { PlayedTurn, Choice } from "@/api/play.api";

type ActivePlayedTurnProps = {
  currentTurn: PlayedTurn;
};

export default function ActivePlayedTurn({
  currentTurn,
}: ActivePlayedTurnProps) {
  const [correctChoice, setCorrectChoice] = useState<Choice | null>(null);

  useEffect(() => {
    setCorrectChoice(
      currentTurn.question.choices.find((choice) => choice.isCorrect) ?? null
    );
  }, [currentTurn]);

  return (
    <View>
      <ThemedText
        style={{
          textAlign: "center",
          fontSize: 40,
          lineHeight: 53,
          fontFamily: "Exo_800ExtraBold",
          letterSpacing: 2,
          backgroundImage:
            "linear-gradient(180deg, #2AD89A 100%, #27EC47 100%, #17BB81 100%)",
          color: "transparent",
          backgroundClip: "text",
        }}
      >
        {correctChoice?.value}
      </ThemedText>
      <View style={{ height: 400 }}></View>
    </View>
  );
}
