import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import PlayerRanking from "./PlayerRanking";
import CurrentQuestionIndicator from "./CurrentQuestionIndicator";
import ActiveTurnTimer from "./ActiveTurnTimer";
import React, { useEffect, useState } from "react";
import ActivePlayableTurn from "./ActivePlayableTurn";
import TurnRecap from "./TurnRecap";
import { Item, Participation, PlayableTurn, PlayedTurn } from "@/api/play.api";
import PlayerStatusList from "./PlayerStatusList";
import { hasStatus, scrambleSentence } from "@/utils/gameUtils";

type ActiveTurnProps = {
  currentTurn: PlayableTurn | PlayedTurn;
  participation: Participation;
};

export default function ActiveGame({
  currentTurn,
  participation,
}: ActiveTurnProps) {
  const [questionTitle, setQuestionTitle] = useState(
    currentTurn.question.title,
  );

  useEffect(() => {
    if (hasStatus(participation, "scramble")) {
      setQuestionTitle(scrambleSentence(currentTurn.question.title));
    } else {
      setQuestionTitle(currentTurn.question.title);
    }
  }, [participation, currentTurn.question.title]);

  // Timer
  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft());

  function getInitialTimeLeft(): number {
    if (!currentTurn.startedAt) return 15;
    const elapsed = Math.floor(
      (Date.now() - new Date(currentTurn.startedAt).getTime()) / 1000,
    );
    return Math.max(15 - elapsed, 0);
  }

  useEffect(() => {
    if (hasStatus(participation, "Hurry")) {
      setTimeLeft(getInitialTimeLeft() - 5);
    } else {
      setTimeLeft(getInitialTimeLeft());
    }
  }, [currentTurn.startedAt, participation]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        padding: 12,
        paddingTop: 0,
      }}
    >
      <View>
        <View
          style={{
            justifyContent: "space-between",
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <CurrentQuestionIndicator
              difficulty={currentTurn.question.difficulty!}
              position={currentTurn.position}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PlayerRanking player={participation!} />
          </View>
        </View>
        {!currentTurn.finishedAt && (
          <ActiveTurnTimer
            timeLeft={timeLeft}
            difficulty={currentTurn.question.difficulty!}
          />
        )}
        <PlayerStatusList participation={participation} />
      </View>
      <View
        style={{
          alignContent: "center",
        }}
      >
        <ThemedText
          style={{
            fontFamily: "Exo_600SemiBold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {questionTitle}
        </ThemedText>
      </View>
      {!currentTurn.finishedAt ? (
        <ActivePlayableTurn
          currentTurn={currentTurn as PlayableTurn}
          participation={participation}
          timeLeft={timeLeft}
        />
      ) : (
        <TurnRecap
          currentTurn={currentTurn as PlayedTurn}
          participation={participation}
        />
      )}
    </View>
  );
}
