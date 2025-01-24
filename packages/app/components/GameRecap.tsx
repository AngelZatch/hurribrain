import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Link } from "expo-router";
import ThemedButton from "./ui/ThemedButton";

export default function GameRecap() {
  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <ThemedText
        style={{
          fontSize: 32,
          fontFamily: "Exo_600SemiBold",
          paddingVertical: 25,
          textAlign: "center",
        }}
      >
        La partie est terminée !
      </ThemedText>
      <View></View>
      <Link replace href="/" asChild>
        <ThemedButton title="Retourner à l'accueil" />
      </Link>
    </View>
  );
}
