import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  PlayedTurn,
  Choice,
  useGetMyAnswer,
  Participation,
} from "@/api/play.api";
import { useAuth } from "@/contexts/auth.context";
import ScoreMedal from "./ScoreMedal";
import { Divider } from "./ui/Divider";
import { OutlinedText } from "./ui/OutlinedText";

type ActivePlayedTurnProps = {
  currentTurn: PlayedTurn;
  participation: Participation;
  availableWidth: number;
};

export default function TurnRecap({
  currentTurn,
  participation,
  availableWidth,
}: ActivePlayedTurnProps) {
  const [correctChoice, setCorrectChoice] = useState<Choice | null>(null);
  const { user } = useAuth();
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "wrong" | "none"
  >("none");

  // Points gained
  const [pointsGained, setPointsGained] = useState<number>(0);

  useEffect(() => {
    setCorrectChoice(
      currentTurn.question.choices.find((choice) => choice.isCorrect) ?? null,
    );
  }, [currentTurn]);

  useEffect(() => {
    setPointsGained(() => participation.score - participation.previousScore);
  }, [participation]);

  // Set my answer if I already answered
  const { data: myAnswer } = useGetMyAnswer(
    user!,
    currentTurn.game,
    currentTurn.uuid,
  );

  useEffect(() => {
    if (!myAnswer || !myAnswer.choice) {
      setAnswerStatus("none");
    } else {
      if (myAnswer.choice.uuid === correctChoice?.uuid) {
        setAnswerStatus("correct");
      } else {
        setAnswerStatus("wrong");
      }
    }
  }, [myAnswer, correctChoice]);

  return (
    <View
      style={{
        flexShrink: 1,
        flexGrow: 1,
        flexBasis: "auto",
        width: "100%",
        gap: 12,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <OutlinedText
          fontSize={40}
          fontFamily="Exo_800ExtraBold"
          fontWeight="800"
          fillColor="linear-gradient(to bottom, #3C73FF, #3AF2F8)"
          strokeColor="#FFFFFF"
          strokeWidth={3}
          text={correctChoice?.value ?? ""}
          width={availableWidth}
          shadowColor="#3c74ff"
          shadowOffsetX={-3}
          shadowOffsetY={-3}
          shadowOpacity={0.4}
          shadowBlur={1}
          letterSpacing={2}
        />
      </View>
      <View
        style={[
          {
            maxHeight: 380,
            borderStyle: "solid",
            borderWidth: 3,
            borderRadius: 10,
            padding: 12,
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "auto",
            backgroundColor: "#0000000C",
            overflow: "hidden",
          },
          answerStatus === "correct" && {
            borderColor: "#3DC96C",
          },
          answerStatus === "wrong" && {
            borderColor: "#F1425F",
          },
          answerStatus === "none" && {
            borderColor: "#919191",
          },
        ]}
      >
        <ThemedText
          style={[
            {
              textAlign: "center",
              fontSize: 18,
              fontFamily: "Exo_700Bold",
              color: "transparent",
              backgroundClip: "text",
            },
            answerStatus === "correct" && {
              backgroundImage:
                "linear-gradient(180deg, #2AD89A 100%, #27EC47 100%, #17BB81 100%)",
            },
            answerStatus === "wrong" && {
              backgroundImage:
                "linear-gradient(180deg, #F1425F 0%, #F1425F 0.01%, #E30026 100%)",
            },
            answerStatus === "none" && {
              backgroundImage:
                "linear-gradient(0deg, #919191 0%, #3C3C3C 100%)",
            },
          ]}
        >
          {answerStatus === "correct" && "Bien joué !"}
          {answerStatus === "wrong" && "Oh non..."}
          {answerStatus === "none" && "Pas de réponse."}
        </ThemedText>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            alignItems: "flex-start",
            overflow: "scroll",
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "100%",
          }}
        >
          {myAnswer?.medals?.map((medal) => (
            <ScoreMedal medal={medal} key={medal} />
          ))}
        </View>
        <Divider orientation="horizontal" size="100%" />
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 32,
            padding: 8,
            fontFamily: "Exo_700Bold",
            textShadowColor: answerStatus === "correct" ? "#3DC96C" : "#D36F6F",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}
        >
          {pointsGained} pt
        </ThemedText>
      </View>
    </View>
  );
}
