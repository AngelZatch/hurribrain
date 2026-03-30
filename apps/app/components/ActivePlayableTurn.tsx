import { View } from "react-native";
import ChoiceOption from "./ChoiceOption";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import {
  PlayableTurn,
  Choice,
  useAnswerQuestion,
  useGetMyAnswer,
  Participation,
} from "@/api/play.api";

type ActivePlayableTurnProps = {
  currentTurn: PlayableTurn;
  participation: Participation;
  timeLeft: number;
};

export default function ActivePlayableTurn({
  currentTurn,
  timeLeft,
}: ActivePlayableTurnProps) {
  const [sentChoice, setSentChoice] = useState<Choice | null>(null);
  const { user } = useAuth();
  const { mutate: answerQuestion } = useAnswerQuestion(user!, currentTurn.game);

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

  const handleSendAnswer = async (choice: Choice) => {
    if (!choice || timeLeft <= 0) {
      return;
    }

    try {
      answerQuestion({
        turnId: currentTurn.uuid,
        choiceId: choice.uuid,
      });
      setSentChoice(choice);
    } catch (error) {
      //TODO: Display error toast
      console.log(error);
    }
  };

  return (
    <>
      <View
        style={{
          gap: 8,
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        {currentTurn.question.choices.map((choice) => (
          <ChoiceOption
            key={choice.uuid}
            onPress={() => handleSendAnswer(choice)}
            choice={choice}
            isSent={sentChoice?.uuid === choice.uuid}
          />
        ))}
      </View>
    </>
  );
}
