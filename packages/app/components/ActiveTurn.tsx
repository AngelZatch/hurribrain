import {
  Choice,
  Turn,
  useAnswerQuestion,
  useGetMyAnswer,
  useGetMyParticipation,
} from "@/api/games.api";
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
  const { mutate: answerQuestion } = useAnswerQuestion(user!, turn.game);

  // By default, set the selected choice to null
  useEffect(() => {
    setSelectedChoice(null);
  }, []);

  // Get the participant's data
  const { data: me, isLoading } = useGetMyParticipation(user!, turn.game);

  // Set my answer if I already answered
  const { data: myAnswer } = useGetMyAnswer(user!, turn.game, turn.uuid);
  useEffect(() => {
    if (myAnswer) {
      setSelectedChoice(myAnswer.choice);
    }
  }, [myAnswer]);

  const handleSendAnswer = () => {
    if (!selectedChoice) {
      return;
    }

    answerQuestion({
      turnId: turn.uuid,
      choiceId: selectedChoice.uuid,
    });
  };

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
      <ThemedButton title="Envoyer" onPress={handleSendAnswer} />
    </View>
  );
};
