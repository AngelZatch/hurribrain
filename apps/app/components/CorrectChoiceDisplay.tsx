import { Choice, PlayedTurn } from "@/api/play.api";
import ThemedText from "./ui/ThemedText";
import { useEffect, useState } from "react";

export default function CorrectChoiceDisplay({
  currentTurn,
}: {
  currentTurn: PlayedTurn;
}) {
  const [correctChoice, setCorrectChoice] = useState<Choice | null>(null);

  useEffect(() => {
    setCorrectChoice(
      currentTurn.question.choices.find((choice) => choice?.isCorrect) ?? null,
    );
  }, [currentTurn]);

  return (
    <ThemedText
      style={{
        textAlign: "center",
        fontSize: 40,
        lineHeight: 53,
        fontFamily: "Exo_800ExtraBold",
        letterSpacing: 2,
        backgroundImage: "linear-gradient(180deg, #3C73FF 0%, #3AF2F8 100%)",
        color: "transparent",
        backgroundClip: "text",
      }}
    >
      {correctChoice?.value}
    </ThemedText>
  );
}
