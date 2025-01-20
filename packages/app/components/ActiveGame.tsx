import {
  Choice,
  Turn,
  useAnswerQuestion,
  useGetMyAnswer,
  useGetMyParticipation,
} from "@/api/games.api";
import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import ThemedButton from "./ui/ThemedButton";
import { useEffect, useState } from "react";
import ChoiceOption from "./ChoiceOption";
import { useAuth } from "@/contexts/auth.context";
import PlayerRanking from "./PlayerRanking";
import CurrentQuestionIndicator from "./CurrentQuestionIndicator";
import ActiveTurnTimer from "./ActiveTurnTimer";

type ActiveTurnProps = {
  currentTurn: Turn;
};

export default function ActiveGame({ currentTurn }: ActiveTurnProps) {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [sentChoice, setSentChoice] = useState<Choice | null>(null);
  const { user } = useAuth();
  const { mutate: answerQuestion } = useAnswerQuestion(user!, currentTurn.game);

  // By default, set the selected choice to null
  useEffect(() => {
    setSelectedChoice(null);
  }, []);

  // Get the participant's data
  const { data: me, isLoading } = useGetMyParticipation(
    user!,
    currentTurn.game
  );

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
          {!isLoading && <PlayerRanking player={me} />}
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
        title={myAnswer ? "Modifier" : "Répondre"}
        onPress={handleSendAnswer}
      />
    </View>
  );
}
