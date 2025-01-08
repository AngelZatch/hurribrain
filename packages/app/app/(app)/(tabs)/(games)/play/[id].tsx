import { useGetGame } from "@/api/games.api";
import { useAuth } from "@/contexts/auth.context";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import GameLobby from "@/components/GameLobby";

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();

  if (!user || !gameId) {
    return null;
  }

  const { data, isLoading, error } = useGetGame(user, gameId);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log(data);

  return (
    <PageContainer>
      <TopNavigation topLabel="Game code:" subLabel={data?.code} />
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
