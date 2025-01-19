import { Turn } from "@/api/games.api";
import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import DifficultyChip from "./DifficultyChip";
import ThemedButton from "./ui/ThemedButton";

type ActiveTurnProps = {
  turn: Turn;
};

export const ActiveTurn = ({ turn }: ActiveTurnProps) => {
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <DifficultyChip difficulty={turn.question.difficulty!} />
          <View>
            <ThemedText
              style={{
                fontFamily: "Exo_700Bold",
              }}
            >
              Question
            </ThemedText>
            <ThemedText
              style={{
                fontFamily: "Exo_700Bold",
                fontSize: 20,
              }}
            >
              {turn.position}
            </ThemedText>
          </View>
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
          {turn.question.title}
        </ThemedText>
      </View>
      <View
        style={{
          gap: 24,
        }}
      >
        {turn.question.choices.map((choice) => (
          <View
            style={{
              paddingHorizontal: 0,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              borderRadius: 16,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#94CED080",
            }}
          >
            <ThemedText
              style={{
                fontFamily: "Exo_600SemiBold",
                fontSize: 16,
              }}
            >
              {choice.value}
            </ThemedText>
          </View>
        ))}
      </View>
      <ThemedButton title="Envoyer" />
    </View>
  );
};
