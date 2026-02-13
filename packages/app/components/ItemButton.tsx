import { Item, Participation, useGetItemList } from "@/api/play.api";
import { socket } from "@/contexts/socket";
import { TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import ThemedText from "./ui/ThemedText";
import { hasStatus } from "@/utils/gameUtils";

type ItemButtonProps = {
  participation: Participation;
  items: Array<Item>;
};

export default function ItemButton({ participation, items }: ItemButtonProps) {
  const { user } = useAuth();

  const [heldItem, setHeldItem] = useState(
    items?.find((i) => i.uuid === participation.activeItem) || null,
  );

  const handleUseItem = () => {
    socket.emit("item:use", {
      game: participation.game,
      user: participation.user,
    });
    setHeldItem(null);
  };

  useEffect(() => {
    // Get the item from the list when activeItem changes
    if (participation.activeItem) {
      const item = items?.find((i) => i.uuid === participation.activeItem);
      console.log("Active item:", item);
      setHeldItem(item || null);
    }
  }, [participation.activeItem]);

  const [hasLock, setHasLock] = useState(false);

  useEffect(() => {
    setHasLock(hasStatus(participation, "lock"));
  }, [participation]);

  return (
    <AnimatedCircularProgress
      size={70}
      width={6}
      fill={participation.itemCharge}
      rotation={0}
      tintColor={"#FFD700"}
      backgroundColor="#2F2F2F"
    >
      {(fill) => (
        <TouchableOpacity
          onPress={handleUseItem}
          disabled={!participation.activeItem || hasLock}
          style={{
            width: 70,
            height: 70,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <ThemedText>{heldItem?.name}</ThemedText>
          </View>
        </TouchableOpacity>
      )}
    </AnimatedCircularProgress>
  );
}
