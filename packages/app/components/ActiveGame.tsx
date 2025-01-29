import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useAuth } from "@/contexts/auth.context";
import PlayerRanking from "./PlayerRanking";
import CurrentQuestionIndicator from "./CurrentQuestionIndicator";
import ActiveTurnTimer from "./ActiveTurnTimer";
import React from "react";
import ActivePlayableTurn from "./ActivePlayableTurn";
import TurnRecap from "./TurnRecap";
import {
  PlayableTurn,
  PlayedTurn,
  useGetMyParticipation,
} from "@/api/play.api";

type ActiveTurnProps = {
  currentTurn: PlayableTurn | PlayedTurn;
};

export default function ActiveGame({ currentTurn }: ActiveTurnProps) {
  const { user } = useAuth();

  // Get the participant's data
  const { data: me, isLoading } = useGetMyParticipation(
    user!,
    currentTurn.game
  );

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
          {!isLoading && <PlayerRanking player={me!} />}
        </View>
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
        <ActivePlayableTurn currentTurn={currentTurn as PlayableTurn} />
      ) : (
        <TurnRecap
          currentTurn={currentTurn as PlayedTurn}
          participation={me!}
        />
      )}
    </View>
  );
}
