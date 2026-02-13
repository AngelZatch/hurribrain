import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { IconSymbol } from "./ui/IconSymbol";
import { useEffect, useState } from "react";
import { PlayableTurn } from "@/api/play.api";

type ActiveTurnTimerProps = {
  currentTurn: PlayableTurn;
};

export default function ActiveTurnTimer({ currentTurn }: ActiveTurnTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft());

  function getInitialTimeLeft(): number {
    if (!currentTurn.startedAt) return 15;
    const elapsed = Math.floor(
      (Date.now() - new Date(currentTurn.startedAt).getTime()) / 1000,
    );
    return Math.max(15 - elapsed, 0);
  }

  useEffect(() => {
    setTimeLeft(getInitialTimeLeft());
  }, [currentTurn.startedAt]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 0,
        borderRadius: 10,
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        flexGrow: 0,
        flexShrink: 1,
        height: 25,
        maxWidth: 92,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <IconSymbol
        name="hourglass"
        size={24}
        style={{
          backgroundImage: "linear-gradient(#3C73FF, #3AF2F8)",
          color: "transparent",
          backgroundClip: "text",
        }}
      />
      <ThemedText
        style={{
          fontFamily: "Exo_600SemiBold",
          fontSize: 20,
          backgroundImage: "linear-gradient(#3C73FF, #3AF2F8)",
          color: "transparent",
          backgroundClip: "text",
        }}
      >
        0:{timeLeft.toString().padStart(2, "0")}
      </ThemedText>
    </View>
  );
}
