import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useState } from "react";
import { PlayedTurn, Choice, useGetMyAnswer } from "@/api/play.api";
import { useAuth } from "@/contexts/auth.context";

type ActivePlayedTurnProps = {
  currentTurn: PlayedTurn;
};

export default function ActivePlayedTurn({
  currentTurn,
}: ActivePlayedTurnProps) {
  const [correctChoice, setCorrectChoice] = useState<Choice | null>(null);
  const { user } = useAuth();
  const [sentChoice, setSentChoice] = useState<Choice | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setCorrectChoice(
      currentTurn.question.choices.find((choice) => choice.isCorrect) ?? null
    );
  }, [currentTurn]);

  // Set my answer if I already answered
  const { data: myAnswer } = useGetMyAnswer(
    user!,
    currentTurn.game,
    currentTurn.uuid
  );

  useEffect(() => {
    if (myAnswer) {
      setSentChoice(myAnswer.choice);
      setIsCorrect(myAnswer.choice === correctChoice);
    }
  }, [myAnswer]);

  return (
    <View>
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
      <View
        style={[
          {
            height: 400,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 10,
            borderColor: isCorrect ? "#3DC96C" : "#F1425F",
            padding: 20,
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 24,
            fontFamily: "Exo_700Bold",
            backgroundImage:
              "linear-gradient(180deg, #F1425F 0%, #F1425F 0.01%, #E30026 100%)",
            color: "transparent",
            backgroundClip: "text",
          }}
        >
          {isCorrect ? "Bien joué !" : "Oh non..."}
        </ThemedText>
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 32,
            fontFamily: "Exo_700Bold",
            textShadowColor: isCorrect ? "#3DC96C" : "#D36F6F",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}
        >
          {isCorrect ? "+1" : "-1"} pt
        </ThemedText>
      </View>
    </View>
  );
}
