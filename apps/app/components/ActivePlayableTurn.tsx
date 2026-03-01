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
  Participation,
} from "@/api/play.api";
import ItemButton from "./ItemButton";

type ActivePlayableTurnProps = {
  currentTurn: PlayableTurn;
  participation: Participation;
  timeLeft: number;
};

export default function ActivePlayableTurn({
  currentTurn,
  participation,
  timeLeft,
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
    currentTurn.uuid,
  );
  useEffect(() => {
    if (myAnswer) {
      setSentChoice(myAnswer.choice);
    }
  }, [myAnswer]);

  const handleSendAnswer = async () => {
    if (!selectedChoice || timeLeft <= 0) {
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
          gap: 12,
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
      <View
        style={{
          display: "flex",
          gap: 24,
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "stretch",
          alignItems: "center",
        }}
      >
        <ItemButton participation={participation} />
        <ThemedButton
          title={sentChoice ? "Modifier" : "Répondre"}
          onPress={handleSendAnswer}
          disabled={!selectedChoice || timeLeft <= 0}
          fullWidth
        />
      </View>
    </>
  );
}
