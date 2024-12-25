import { useGetGames } from "@/api/games.api";
import ProfileBanner from "@/components/ProfileBanner";
import { PageContainer } from "@/components/ui/PageContainer";
import { useAuth } from "@/contexts/auth.context";
import { View, Text } from "react-native";

export default function GamesScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const { data, isLoading, error } = useGetGames(user);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log(data);

  return (
    <PageContainer>
      <ProfileBanner />
      <View style={{ flex: 1 }}>
        <Text>Games</Text>
      </View>
    </PageContainer>
  );
}
