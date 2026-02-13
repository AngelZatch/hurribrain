import { Item, Participation } from "@/api/play.api";
import { View } from "react-native";
import StatusTimer from "./StatusTimer";

export default function PlayerStatusList({
  participation,
}: {
  participation: Participation;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {participation.statuses.map((status) => (
        <StatusTimer
          key={status.name}
          name={status.name}
          duration={status.duration}
        />
      ))}{" "}
    </View>
  );
}
