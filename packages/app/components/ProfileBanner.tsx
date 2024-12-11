import { Text, View } from "react-native";
import ExperienceBar from "./ExperienceBar";
import Avatar from "./Avatar";

import { useColorScheme } from "../hooks/useColorScheme";
import ThemedText from "./ThemedText";
import CoinCount from "./CoinCount";
import { Divider } from "./ui/Divider";

export default function ProfileBanner() {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        maxHeight: 82,
        width: "100%",
        gap: 10,
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: "row",
      }}
    >
      <Avatar />
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        <ThemedText
          style={{
            fontSize: 16,
            fontFamily: "Exo_700Bold",
          }}
        >
          Na'el
        </ThemedText>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            paddingVertical: 3,
            alignItems: "center",
          }}
        >
          <ExperienceBar current={50} level={2} />
          <Divider orientation="vertical" size={15} />
          <CoinCount count={138} />
        </View>
      </View>
    </View>
  );
}
