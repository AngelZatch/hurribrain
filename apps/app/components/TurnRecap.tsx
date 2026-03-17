import { Animated, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useRef, useState } from "react";
import { PlayedTurn, useGetMyAnswer, Participation } from "@/api/play.api";
import { useAuth } from "@/contexts/auth.context";
import ScoreMedal from "./ScoreMedal";
import { Divider } from "./ui/Divider";

type ActivePlayedTurnProps = {
  currentTurn: PlayedTurn;
  participation: Participation;
};

export default function TurnRecap({
  currentTurn,
  participation,
}: ActivePlayedTurnProps) {
  const { user } = useAuth();
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "wrong" | "none"
  >("none");

  // Points gained
  const [displayedPointsGained, setDisplayedPointsGained] = useState<number>(0);

  // Set my answer if I already answered
  const { data: myAnswer } = useGetMyAnswer(
    user!,
    currentTurn.game,
    currentTurn.uuid,
  );

  // Animations
  const openingAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(openingAnim, {
      toValue: 400,
      friction: 5,
      tension: 5,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [openingAnim]);

  useEffect(() => {
    const pointsGained = participation.score - participation.previousScore;

    const pointsGainedTimerId = setInterval(() => {
      setDisplayedPointsGained((previousValue) => {
        if (previousValue < pointsGained) return previousValue + 1;
        if (previousValue > pointsGained) return previousValue - 1;
        return previousValue;
      });
    }, 50);

    return () => clearInterval(pointsGainedTimerId);
  }, [participation]);

  useEffect(() => {
    const correctChoice = currentTurn.question.choices.find(
      (choice) => choice.isCorrect ?? null,
    );
    if (!myAnswer || !myAnswer.choice) {
      setAnswerStatus("none");
    } else {
      if (myAnswer.choice.uuid === correctChoice?.uuid) {
        setAnswerStatus("correct");
      } else {
        setAnswerStatus("wrong");
      }
    }
  }, [myAnswer]);

  return (
    <Animated.View
      style={[
        {
          // maxHeight: 400,
          borderStyle: "solid",
          borderWidth: 3,
          borderRadius: 10,
          padding: 12,
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexGrow: 1,
          flexBasis: "auto",
          backgroundColor: "#0000000C",
          overflow: "hidden",
          maxHeight: openingAnim,
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
            fontSize: 32,
            fontFamily: "Exo_700Bold",
            color: "transparent",
            backgroundClip: "text",
            lineHeight: 48,
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
            backgroundImage: "linear-gradient(0deg, #919191 0%, #3C3C3C 100%)",
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
          maxHeight: 300,
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          alignContent: "flex-start",
          overflow: "scroll",
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
          lineHeight: 48,
          fontFamily: "Exo_800ExtraBold",
          textShadowColor: answerStatus === "correct" ? "#3DC96C" : "#D36F6F",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        }}
      >
        {displayedPointsGained} pt
      </ThemedText>
    </Animated.View>
  );
}
