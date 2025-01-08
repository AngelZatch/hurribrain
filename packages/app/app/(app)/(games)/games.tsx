import { useGetGames } from "@/api/games.api";
import GameListItem from "@/components/GameListItem";
import ProfileBanner from "@/components/ProfileBanner";
import { PageContainer } from "@/components/ui/PageContainer";
import { useAuth } from "@/contexts/auth.context";
import { View, Text } from "react-native";
import { Link, router, useRouter } from "expo-router";

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
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
          alignSelf: "stretch",
          overflow: "scroll",
        }}
      >
        {data &&
          data.data.map((game) => (
            <Link
              href={{
                pathname: "/play/[id]",
                params: { id: game.uuid },
              }}
              style={{ width: "100%" }}
            >
              <GameListItem key={game.uuid} game={game} />
            </Link>
          ))}
      </View>
    </PageContainer>
  );
}
