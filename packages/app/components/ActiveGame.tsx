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
  items: Array<Item>;
};

export default function ActiveGame({
  currentTurn,
  participation,
  items,
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        padding: 12,
        paddingTop: 0,
      }}
    >
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
        <View style={{ flex: 1, alignItems: "center" }}>
          {!currentTurn.finishedAt && <ActiveTurnTimer />}
        </View>
        <View style={{ flex: 1 }}>
          <PlayerRanking player={participation!} />
        </View>
      </View>
      <PlayerStatusList participation={participation} />
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
          items={items}
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
