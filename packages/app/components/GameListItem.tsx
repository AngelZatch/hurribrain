import { Text, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import TagChip from "./TagChip";
import Avatar from "./Avatar";

interface GameListItemProps {
  game: {
    uuid: string;
    code: string;
    tags: Array<{ uuid: string; name: string; description?: string }>;
    length: number;
    difficulty: string;
  };
}

export default function GameListItem({ game }: GameListItemProps) {
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
      <Avatar />
      <View style={{ display: "flex", flexDirection: "column" }}>
        <ThemedText
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: "Exo_600SemiBold",
          }}
        >
          {game.code}
        </ThemedText>
        <View style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          {game.tags.map((tag) => (
            <TagChip key={tag.uuid} text={tag.name} />
          ))}
        </View>
      </View>
    </View>
  );
}
