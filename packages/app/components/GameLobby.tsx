import { View, StyleSheet } from "react-native";
import ThemedText from "./ui/ThemedText";
import DifficultyChip from "./DifficultyChip";
import { Game } from "@/api/games.api";
import TagChip from "./TagChip";

type GameLobbyChips = {
  game: Game;
};

export default function GameLobby({ game }: GameLobbyChips) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 8,
        gap: 10,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 0,
      }}
    >
      <ThemedText
        type="smallTitle"
        style={{
          textAlign: "center",
        }}
      >
        The game will start soon
      </ThemedText>
      <View
        style={{
          padding: 10,
          borderRadius: 10,
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#EC9D27",
          width: "100%",
        }}
      >
        <ThemedText
          style={{
            fontSize: 16,
            fontFamily: "Exo_600SemiBold",
            lineHeight: 21,
            color: "#EC9D27",
          }}
        >
          Game Rules
        </ThemedText>
        <View style={styles.ruleContainer}>
          <ThemedText>Themes</ThemedText>
          <View>
            {game.tags.map((tag) => (
              <TagChip key={tag.uuid} text={tag.name} />
            ))}
          </View>
        </View>
        <View style={styles.ruleContainer}>
          <ThemedText>Difficulty</ThemedText>
          <DifficultyChip difficulty={game.difficulty} fullSize />
        </View>
        <View style={styles.ruleContainer}>
          <ThemedText>Length</ThemedText>
          <ThemedText>{game.length} questions</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ruleContainer: {
    height: 50,
    padding: 10,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
