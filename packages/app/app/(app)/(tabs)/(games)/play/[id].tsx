import { useGetGame } from "@/api/games.api";
import { useAuth } from "@/contexts/auth.context";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import GameLobby from "@/components/GameLobby";
import { socket } from "@/api/socket";

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useGetGame(user!, gameId);

  useEffect(() => {
    if (!data?.uuid) {
      return;
    }

    socket.on("connect", () => {
      console.log("connected");
      socket.send("game:join", data.uuid);
    });

    // Clean up
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [data?.uuid]);

  if (!data) {
    return null;
  }

  return (
    <PageContainer>
      <TopNavigation
        topLabel={data?.isPrivate ? "Partie Privée" : "Partie Rapide"}
        subLabel={data?.code}
      />
      <View
        style={{
          padding: 8,
          flex: 1,
          width: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].containerBackground,
          borderRadius: 20,
          borderWidth: 1,
          borderStyle: "solid",
          backdropFilter: "blur(5px)",
          borderColor:
            "linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, rgba(218, 191, 224, 0.1) 33%, rgba(176, 130, 193, 0.3) 67%, rgba(176, 130, 193, 0.5) 100%)",
        }}
      >
        <GameLobby game={data!} />
      </View>
    </PageContainer>
  );
}
