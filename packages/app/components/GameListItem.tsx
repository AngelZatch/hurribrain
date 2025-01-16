import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import TagChip from "./TagChip";
import Avatar from "./Avatar";
import DifficultyChip from "./DifficultyChip";
import { Game } from "@/api/games.api";
import { IconSymbol } from "./ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import PlayerCount from "./PlayerCount";

interface GameListItemProps {
  game: Game;
}

export default function GameListItem({ game }: GameListItemProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        width: "100%",
        padding: 10,
        gap: 10,
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        borderRadius: 10,
        backgroundColor: "#FFFFFF4D",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar />
        <PlayerCount count={game.playerCount!} />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 5,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
        }}
      >
        <View
          style={{
            display: "flex",
            paddingHorizontal: 0,
            paddingVertical: 5,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              lineHeight: 27,
              fontFamily: "Exo_600SemiBold",
            }}
          >
            {game.code}
          </ThemedText>
          <DifficultyChip difficulty={game.difficulty} fullSize />
          <ThemedText
            style={{
              fontSize: 16,
              lineHeight: 21,
              fontFamily: "Exo_400Regular",
            }}
          >
            {game.length} tours
          </ThemedText>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 5,
            paddingVertical: 5,
          }}
        >
          {game.tags.map((tag) => (
            <TagChip key={tag.uuid} text={tag.name} active />
          ))}
        </View>
      </View>
    </View>
  );
}
