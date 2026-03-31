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
    if (!myAnswer || !myAnswer.choice?.uuid) {
      setAnswerStatus("none");
    } else {
      if (myAnswer.choice.uuid === correctChoice?.uuid) {
        setAnswerStatus("correct");
      } else {
        setAnswerStatus("wrong");
      }
    }
  }, [myAnswer, correctChoice]);

  if (!correctChoice) {
    return null;
  }

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
          fontSize={correctChoice.value.length > 20 ? 24 : 40}
          fontFamily="Exo_800ExtraBold"
          fontWeight="800"
          fillColor={
            answerStatus === "correct"
              ? "linear-gradient(180deg, #2AD89A, #27EC47, #17BB81)"
              : answerStatus === "wrong"
                ? "linear-gradient(180deg, #F1425F, #E30026)"
                : "linear-gradient(0deg, #919191, #3C3C3C)"
          }
          strokeColor="#FFFFFF"
          strokeWidth={4}
          text={correctChoice.value}
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
            paddingHorizontal: 8,
            paddingVertical: 12,
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "auto",
            backgroundColor: "#0000000C",
            overflow: "hidden",
            flexDirection: "row",
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
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
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
        <Divider orientation="vertical" size="100%" />
        <View
          style={{
            flexDirection: "row",
            gap: 4,
          }}
        >
          <ThemedText
            style={{
              textAlign: "center",
              fontSize: 18,
              fontFamily: "Exo_700Bold",
              textShadowColor:
                answerStatus === "correct" ? "#3DC96C" : "#D36F6F",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
            }}
          >
            {pointsGained > 0 ? "+" : pointsGained === 0 ? "" : "-"}{" "}
            {pointsGained}
          </ThemedText>
          <ThemedText
            style={{
              textAlign: "center",
              fontSize: 12,
              fontFamily: "Exo_400Regular",
              textShadowColor:
                answerStatus === "correct" ? "#3DC96C" : "#D36F6F",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
            }}
          >
            {pointsGained > 1 ? "pts" : "pt"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
