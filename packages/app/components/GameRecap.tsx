import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { router } from "expo-router";
import ThemedButton from "./ui/ThemedButton";

export default function GameRecap() {
  const navigateToHome = () => {
    router.dismissAll();
    router.replace("/");
  };

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
      <ThemedButton title="Retourner à l'accueil" onPress={navigateToHome} />
    </View>
  );
}
