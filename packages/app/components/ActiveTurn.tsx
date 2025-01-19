import { Choice, Turn, useGetMyParticipation } from "@/api/games.api";
import { Pressable, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import DifficultyChip from "./DifficultyChip";
import ThemedButton from "./ui/ThemedButton";
import { useEffect, useState } from "react";
import ChoiceOption from "./ChoiceOption";
import { useAuth } from "@/contexts/auth.context";
import PlayerRanking from "./PlayerRanking";
import CurrentQuestionIndicator from "./CurrentQuestionIndicator";

type ActiveTurnProps = {
  turn: Turn;
};

export const ActiveTurn = ({ turn }: ActiveTurnProps) => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setSelectedChoice(null);
  }, []);

  const { data: me, isLoading } = useGetMyParticipation(user!, turn.game);

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
        }}
      >
        <CurrentQuestionIndicator
          difficulty={turn.question.difficulty!}
          position={turn.position}
        />
        {!isLoading && <PlayerRanking player={me} />}
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
          {turn.question.title}
        </ThemedText>
      </View>
      <View
        style={{
          gap: 24,
        }}
      >
        {turn.question.choices.map((choice) => (
          <ChoiceOption
            key={choice.uuid}
            onPress={() => setSelectedChoice(choice)}
            choice={choice}
            isSelected={selectedChoice === choice}
          />
        ))}
      </View>
      <ThemedButton title="Envoyer" />
    </View>
  );
};
