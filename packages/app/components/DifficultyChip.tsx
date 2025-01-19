import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Question } from "@/api/games.api";

type DifficultyChipProps = {
  difficulty: Question["difficulty"];
  fullSize?: boolean;
};

export default function DifficultyChip({
  difficulty = "unknown",
  fullSize = false,
}: DifficultyChipProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 4,
          width: fullSize ? 82 : 27,
          height: 27,
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
      {fullSize ? (
        <ThemedText
          style={{
            color: "#FFFFFF",
            textTransform: "capitalize",
            fontSize: 14,
          }}
        >
          {difficulty === "easy" && "Facile"}
          {difficulty === "medium" && "Moyenne"}
          {difficulty === "hard" && "Difficile"}
          {difficulty === "expert" && "Experte"}
          {difficulty === "unknown" && "Inconnue"}
        </ThemedText>
      ) : (
        <ThemedText style={{ color: "#FFFFFF", fontSize: 14 }}>
          {difficulty === "easy" && "^^"}
          {difficulty === "medium" && "^^'"}
          {difficulty === "hard" && ">.<"}
          {difficulty === "expert" && "X.x"}
          {difficulty === "unknown" && "?"}
        </ThemedText>
      )}
    </View>
  );
}
