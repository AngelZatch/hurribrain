import { Question, Turn } from "@/api/games.api";
import { View } from "react-native";
import DifficultyChip from "./DifficultyChip";
import ThemedText from "./ui/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type CurrentQuestionIndicatorProps = {
  difficulty: Question["difficulty"];
  position: number;
};

export default function CurrentQuestionIndicator({
  difficulty,
  position,
}: CurrentQuestionIndicatorProps) {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      }}
    >
      <DifficultyChip difficulty={difficulty} />
      <View>
        <ThemedText
          style={{
            fontFamily: "Exo_700Bold",
            letterSpacing: 0.7,
            color: Colors[colorScheme].fadedWhite,
          }}
        >
          Question
        </ThemedText>
        <ThemedText
          style={{
            fontFamily: "Exo_700Bold",
            fontSize: 20,
            color: Colors[colorScheme].fadedWhite,
          }}
        >
          {position}
        </ThemedText>
      </View>
    </View>
  );
}
