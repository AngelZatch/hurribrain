import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import Avatar from "./Avatar";
import { Participation } from "@/api/play.api";

type LeaderboardItemProps = {
  participation: Participation;
};

export default function LeaderboardItem({
  participation,
}: LeaderboardItemProps) {
  return (
    <View
      style={{
        paddingVertical: 10,
        flexDirection: "row",
        gap: 10,
        flexGrow: 0,
        flexShrink: 1,
        alignItems: "center",
      }}
    >
      <ThemedText
        style={{
          color: "#5F5F5F",
          fontFamily: "Exo_600SemiBold",
        }}
      >
        {!participation.rank && "--"}
      </ThemedText>
      <View
        style={{
          flexGrow: 1,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Avatar />
        <ThemedText
          style={{
            fontFamily: "Exo_600SemiBold",
            fontSize: 16,
          }}
        >
          {participation.user.name}
        </ThemedText>
      </View>
      <ThemedText
        style={{
          fontFamily: "Exo_600SemiBold",
          fontSize: 16,
        }}
      >
        {participation.score} pts
      </ThemedText>
    </View>
  );
}
