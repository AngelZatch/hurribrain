import { View, StyleSheet } from "react-native";
import ThemedText from "./ui/ThemedText";
import DifficultyChip from "./DifficultyChip";
import { Game } from "@/api/games.api";
import TagChip from "./TagChip";
import { useAuth } from "@/contexts/auth.context";
import ThemedButton from "./ui/ThemedButton";
import { useGetMe } from "@/api/auth.api";
import PlayerCount from "./PlayerCount";
import { useStartGame } from "@/api/play.api";

type GameLobbyProps = {
  game: Game;
};

export default function GameLobby({ game }: GameLobbyProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const { data, isLoading, isError } = useGetMe(user);
  const { mutateAsync: startGame } = useStartGame(user);

  const isCreator = user && game.creator?.uuid === data?.uuid;

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
        {isCreator
          ? "En attente de joueurs..."
          : "La partie va bientôt commencer"}
      </ThemedText>
      {game.playerCount && <PlayerCount count={game.playerCount} />}
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
          Règles de la partie
        </ThemedText>
        <View style={styles.ruleContainer}>
          <ThemedText>Thèmes</ThemedText>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              flexWrap: "wrap",
              flexShrink: 1,
              justifyContent: "flex-end",
            }}
          >
            {game.tags.map((tag) => (
              <TagChip key={tag.uuid} text={tag.name} active />
            ))}
          </View>
        </View>
        <View style={styles.ruleContainer}>
          <ThemedText>Difficulté</ThemedText>
          <DifficultyChip difficulty={game.difficulty} fullSize />
        </View>
        <View style={styles.ruleContainer}>
          <ThemedText>Durée</ThemedText>
          <ThemedText>{game.length} questions</ThemedText>
        </View>
      </View>
      {isCreator && (
        <ThemedButton
          title="Démarrer la partie"
          onPress={() => startGame(game.uuid)}
          disabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ruleContainer: {
    minHeight: 50,
    padding: 10,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
