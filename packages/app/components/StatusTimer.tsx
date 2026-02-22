import { ImageBackground, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { StatusName } from "@/api/play.api";
import buffImage from "@/assets/images/items/buff-shape.png";
import debuffImage from "@/assets/images/items/debuff-shape.png";
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
        source={isBuff ? buffImage : debuffImage}
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
