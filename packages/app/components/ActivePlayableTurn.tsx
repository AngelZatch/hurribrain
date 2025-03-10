import { View } from "react-native";
import ChoiceOption from "./ChoiceOption";
import { useEffect, useState } from "react";
import ThemedButton from "./ui/ThemedButton";
import { useAuth } from "@/contexts/auth.context";
import {
  PlayableTurn,
  Choice,
  useAnswerQuestion,
  useGetMyAnswer,
} from "@/api/play.api";

type ActivePlayableTurnProps = {
  currentTurn: PlayableTurn;
};

export default function ActivePlayableTurn({
  currentTurn,
}: ActivePlayableTurnProps) {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [sentChoice, setSentChoice] = useState<Choice | null>(null);
  const { user } = useAuth();
  const { mutate: answerQuestion } = useAnswerQuestion(user!, currentTurn.game);

  // By default, set the selected choice to null
  useEffect(() => {
    setSelectedChoice(null);
  }, []);

  // Set my answer if I already answered
  const { data: myAnswer } = useGetMyAnswer(
    user!,
    currentTurn.game,
    currentTurn.uuid
  );
  useEffect(() => {
    if (myAnswer) {
      setSentChoice(myAnswer.choice);
    }
  }, [myAnswer]);

  const handleSendAnswer = async () => {
    if (!selectedChoice) {
      return;
    }

    await answerQuestion({
      turnId: currentTurn.uuid,
      choiceId: selectedChoice.uuid,
    });

    setSentChoice(selectedChoice);
  };

  return (
    <>
      <View
        style={{
          gap: 24,
        }}
      >
        {currentTurn.question.choices.map((choice) => (
          <ChoiceOption
            key={choice.uuid}
            onPress={() => setSelectedChoice(choice)}
            choice={choice}
            isSelected={selectedChoice?.uuid === choice.uuid}
            isSent={sentChoice?.uuid === choice.uuid}
          />
        ))}
      </View>
      <ThemedButton
        title={sentChoice ? "Modifier" : "Répondre"}
        onPress={handleSendAnswer}
        disabled={!selectedChoice}
      />
    </>
  );
}
