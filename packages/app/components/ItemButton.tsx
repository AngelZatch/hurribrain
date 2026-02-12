import { Participation, useGetItemList } from "@/api/play.api";
import { socket } from "@/contexts/socket";
import { TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import ThemedText from "./ui/ThemedText";

type ItemButtonProps = {
  participation: Participation;
};

export default function ItemButton({ participation }: ItemButtonProps) {
  const { user } = useAuth();

  // TODO: Move the get item list to the active game component to prevent fetching it multiple times
  const { data: items } = useGetItemList(user!, participation.game!);

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
          // disabled={!participation.activeItem || isUsingItem}
          disabled={!participation.activeItem}
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
