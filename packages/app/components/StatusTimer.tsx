import { Image, ImageBackground, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { StatusName } from "@/api/play.api";
import { useEffect, useState } from "react";

type StatusTimerProps = {
  name: StatusName;
  duration: number;
};

export default function StatusTimer({ name, duration }: StatusTimerProps) {
  const buffs: Array<StatusName> = ["Boost", "Half", "Hidden", "Shield"];

  const [isBuff, setIsBuff] = useState(false);

  useEffect(() => {
    setIsBuff(buffs.includes(name));
  }, [name]);

  const getCorrectImage = (name: StatusName) => {
    switch (name) {
      case "Boost":
        return require("@/assets/images/items/item-Boost.png");
      case "Darkness":
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
      case "Scramble":
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

  return (
    <View
      style={{
        width: 40,
        height: 67,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ImageBackground
        source={
          isBuff
            ? require("@/assets/images/items/buff-shape.png")
            : require("@/assets/images/items/debuff-shape.png")
        }
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          top: isBuff ? -7 : 7,
        }}
      />
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Image
          source={getCorrectImage(name)}
          style={{
            width: 20,
            height: 20,
          }}
        />
        <ThemedText
          style={{
            fontFamily: "Exo_800ExtraBold",
            fontSize: 14,
            color: "#FFFFFF",
          }}
        >
          {duration}
        </ThemedText>
      </View>
    </View>
  );
}
