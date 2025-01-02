import { useGetGame } from "@/api/games.api";
import { useAuth } from "@/contexts/auth.context";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";

export default function PlayScreen() {
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
      <View>
        <Text>Play Screen</Text>
      </View>
    </PageContainer>
  );
}
