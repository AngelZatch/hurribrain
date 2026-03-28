import { Image, View } from "react-native";
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
import ItemButton from "./ItemButton";

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
        paddingHorizontal: 12,
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
      </View>
      <View
        style={{
          alignContent: "center",
          gap: 12,
          width: "100%",
          flexBasis: "auto",
          aspectRatio: 1.3,
          justifyContent: "center",
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
        {currentTurn.question.asset && (
          <View
            style={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "auto",
              aspectRatio: 1.4,
              borderRadius: 8,
              overflow: "hidden",
              backgroundImage: `url(${currentTurn.question.asset.uri})`,
              backgroundPosition: "center",
              backgroundSize: "300%",
              backgroundRepeat: "no-repeat",
              borderWidth: 3,
              borderColor: "gray",
              borderStyle: "solid",
            }}
          >
            <View
              style={{
                backdropFilter: "blur(5px)",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                source={{ uri: currentTurn.question.asset.uri }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
        )}
      </View>
      <View>
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
      <View
        style={{
          display: "flex",
          gap: 24,
          maxHeight: 140,
          height: 140,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignSelf: "stretch",
          alignItems: "flex-end",
        }}
      >
        <ItemButton participation={participation} />
        <PlayerStatusList participation={participation} />
      </View>
    </View>
  );
}
