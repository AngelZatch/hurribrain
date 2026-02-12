import { Item, Participation } from "@/api/play.api";
import { View } from "react-native";
import StatusTimer from "./StatusTimer";

export default function PlayerStatusList({
  participation,
  items,
}: {
  participation: Participation;
  items: Array<Item>;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {participation.statuses.map((status) => (
        <StatusTimer
          key={status.itemUuid}
          item={items.find((i) => i.uuid === status.itemUuid)!}
          duration={status.duration}
        />
      ))}{" "}
    </View>
  );
}
