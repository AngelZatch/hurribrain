import { ItemName, Participation } from "@/api/play.api";
import { socket } from "@/contexts/socket";
import { Image, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useEffect, useState } from "react";
import { hasStatus } from "@/utils/gameUtils";

type ItemButtonProps = {
  participation: Participation;
};

export default function ItemButton({ participation }: ItemButtonProps) {
  const [heldItem, setHeldItem] = useState(participation.activeItem);

  const getCorrectImage = (name: ItemName) => {
    switch (name) {
      case "Boost":
        return require("@/assets/images/items/item-Boost.png");
      case "Darkness":
      case "Super Darkness":
        return require("@/assets/images/items/item-Darkness.png");
      case "Half":
        return require("@/assets/images/items/item-Half.png");
      case "Hidden":
        return require("@/assets/images/items/item-Hidden.png");
      case "Hurry":
        return require("@/assets/images/items/item-Hurry.png");
      case "Judge":
        return require("@/assets/images/items/item-Judge.png");
      case "Lock":
        return require("@/assets/images/items/item-Lock.png");
      case "Super Quake":
        return require("@/assets/images/items/item-Quake.png");
      case "Scramble":
      case "Super Scramble":
        return require("@/assets/images/items/item-Scramble.png");
      case "Shield":
        return require("@/assets/images/items/item-Shield.png");
      case "Turnaround":
        return require("@/assets/images/items/item-Turnaround.png");
      case "Coin":
      default:
        return require("@/assets/images/items/item-Coin.png");
    }
  };

  const handleUseItem = () => {
    if (hasLock) {
      return;
    }

    socket.emit("item:use", {
      game: participation.game,
      user: participation.user,
    });
    setHeldItem(null);
  };

  useEffect(() => {
    setHeldItem(participation.activeItem || null);
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
      tintColor={"#00d9ff"}
      backgroundColor="#bdbdbd"
      // style={{
      //   boxShadow: "0px 0px 7px #00d9ffFF",
      // }}
    >
      {() => (
        <TouchableOpacity
          onPress={handleUseItem}
          disabled={!heldItem || hasLock}
          style={[
            {
              width: 70,
              height: 70,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 9999,
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: heldItem
                ? "linear-gradient(to bottom, #0061ff,#4a8af4)"
                : "linear-gradient(to bottom, #7b7b7b,#c6c6c6)",
              boxShadow: "0px 2px 1px 1px #00000033",
            },
          ]}
        >
          <View>
            {heldItem && (
              <Image
                source={getCorrectImage(heldItem)}
                style={{
                  width: 32,
                  height: 32,
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
    </AnimatedCircularProgress>
  );
}
