import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useState } from "react";
import {
  PlayedTurn,
  Choice,
  useGetMyAnswer,
  Participation,
} from "@/api/play.api";
import { useAuth } from "@/contexts/auth.context";
import ScoreMedal, { DifficultyMedal } from "./ScoreMedal";
import { Divider } from "./ui/Divider";

type ActivePlayedTurnProps = {
  currentTurn: PlayedTurn;
  participation: Participation;
};

export default function TurnRecap({
  currentTurn,
  participation,
}: ActivePlayedTurnProps) {
  const [correctChoice, setCorrectChoice] = useState<Choice | null>(null);
  const { user } = useAuth();
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "wrong" | "none"
  >("none");
  const [difficultyMedalAwarded, setDifficultyMedalAwarded] =
    useState<boolean>(false);
  const [streakMedalAwarded, setStreakMedalAwarded] = useState<boolean>(false);
  const [pointsGained, setPointsGained] = useState<number>(0);

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
    if (myAnswer && myAnswer.choice) {
      if (myAnswer.choice.uuid === correctChoice?.uuid) {
        setAnswerStatus("correct");
        setPointsGained((value) => value + 1);
      } else {
        setAnswerStatus("wrong");
        setPointsGained(-1);
      }
    } else {
      setAnswerStatus("none");
      setPointsGained(0);
    }
  }, [myAnswer, correctChoice]);

  useEffect(() => {
    setDifficultyMedalAwarded(false);
    if (answerStatus === "correct") {
      if (currentTurn.question.difficulty === "medium") {
        setDifficultyMedalAwarded(true);
        setPointsGained((value) => value + 1);
      } else if (currentTurn.question.difficulty === "hard") {
        setDifficultyMedalAwarded(true);
        setPointsGained((value) => value + 2);
      } else if (currentTurn.question.difficulty === "expert") {
        setDifficultyMedalAwarded(true);
        setPointsGained((value) => value + 3);
      }
    }
  }, [answerStatus, currentTurn.question.difficulty]);

  useEffect(() => {
    setStreakMedalAwarded(false);
    if (participation.streak % 5 === 0) {
      setStreakMedalAwarded(true);
      setPointsGained((value) => value + participation.streak / 5);
    }
  }, [participation.streak]);

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
            padding: 20,
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
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
              fontSize: 24,
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
            gap: 10,
            flex: 1,
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <ScoreMedal
            medalType={{
              type: "base",
              value: answerStatus,
            }}
          />
          {difficultyMedalAwarded && (
            <ScoreMedal
              medalType={{
                type: "difficulty",
                value: currentTurn.question.difficulty as DifficultyMedal,
              }}
            />
          )}
          {streakMedalAwarded && (
            <ScoreMedal
              medalType={{
                type: "chain",
                value: participation.streak,
              }}
            />
          )}
        </View>
        <Divider orientation="horizontal" size="100%" />
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 32,
            lineHeight: 48,
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
