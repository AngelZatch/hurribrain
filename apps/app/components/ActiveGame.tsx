import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import PlayerScoreDisplay from "./PlayerScoreDisplay";
import CurrentQuestionDisplay from "./CurrentQuestionDisplay";
import TurnTimer from "./TurnTimer";
import React, { useEffect, useState } from "react";
import ActivePlayableTurn from "./ActivePlayableTurn";
import TurnRecap from "./TurnRecap";
import { Participation, PlayableTurn, PlayedTurn } from "@/api/play.api";
import PlayerStatusList from "./PlayerStatusList";
import { hasStatus } from "@/utils/gameUtils";
import { Game } from "@/api/games.api";
import PlayerRankDisplay from "./PlayerRankDisplay";

type ActiveTurnProps = {
  game: Game;
  currentTurn: PlayableTurn | PlayedTurn;
  participation: Participation;
};

export default function ActiveGame({
  game,
  currentTurn,
  participation,
}: ActiveTurnProps) {
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
            <CurrentQuestionDisplay
              position={currentTurn.position}
              length={game.length}
            />
          </View>
          <View>
            {participation.rank > 0 && (
              <PlayerRankDisplay rank={participation.rank} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <PlayerScoreDisplay score={participation!.score} />
          </View>
        </View>
        {!currentTurn.finishedAt && (
          <TurnTimer
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
          {currentTurn.question.title}
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
