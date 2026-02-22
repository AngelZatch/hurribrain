import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

type CurrentQuestionIndicatorProps = {
  position: number;
  length: number;
};

export default function CurrentQuestionDisplay({
  position,
  length,
}: CurrentQuestionIndicatorProps) {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      <ThemedText
        style={{
          fontFamily: "Exo_700Bold",
          fontSize: 16,
          letterSpacing: 1.2,
          textShadowColor: "#00000033",
          textShadowOffset: {
            height: 2,
            width: 2,
          },
          textShadowRadius: 3,
        }}
      >
        {position}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          fontFamily: "Exo_400Regular",
          letterSpacing: 1.2,
          textShadowColor: "#00000033",
          textShadowOffset: {
            height: 2,
            width: 2,
          },
          textShadowRadius: 3,
        }}
      >
        {"/"}
        {length}
      </ThemedText>
    </View>
  );
}
