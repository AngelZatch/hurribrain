import { View } from "react-native";
import ThemedText from "./ui/ThemedText";

type DifficultyChipProps = {
  difficulty: "easy" | "medium" | "hard" | "expert" | "unknown";
  fullSize?: boolean;
};

export default function DifficultyChip({
  difficulty,
  fullSize = false,
}: DifficultyChipProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 4,
          width: 82,
          borderRadius: 9999,
          justifyContent: "center",
          alignItems: "center",
        },
        difficulty === "easy" && { backgroundColor: "#3DC96C" },
        difficulty === "medium" && { backgroundColor: "#D1A256" },
        difficulty === "hard" && { backgroundColor: "#E0521E" },
        difficulty === "expert" && { backgroundColor: "#990000" },
        difficulty === "unknown" && { backgroundColor: "#5F5F5F" },
      ]}
    >
      {fullSize && (
        <ThemedText style={{ color: "#FFFFFF", textTransform: "capitalize" }}>
          {difficulty}
        </ThemedText>
      )}
    </View>
  );
}
