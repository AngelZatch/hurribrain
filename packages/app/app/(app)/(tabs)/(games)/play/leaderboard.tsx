import { useGetLeaderboard } from "@/api/games.api";
import LeaderboardItem from "@/components/LeaderboardItem";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { ContainerView } from "@/components/ui/ContainerView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedIconButton from "@/components/ui/ThemedIconButton";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/auth.context";
import { Link, router, useLocalSearchParams } from "expo-router";

export default function Leaderboard() {
  const isPresented = router.canGoBack();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();

  const { data: leaderboard, isLoading } = useGetLeaderboard(user!, gameId);

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <ThemedText
            style={{
              fontSize: 20,
              fontFamily: "Exo_600SemiBold",
              letterSpacing: 1,
            }}
          >
            Classement
          </ThemedText>
        }
        rightElement={
          isPresented ? (
            <Link href={isPresented ? "../" : "/"} asChild>
              <ThemedIconButton icon="xmark" />
            </Link>
          ) : (
            <ThemedText>Accueil</ThemedText>
          )
        }
      />
      <ContainerView>
        {isLoading && <ThemedText>Loading...</ThemedText>}
        {leaderboard?.map((participation) => (
          <LeaderboardItem
            key={participation.user.uuid}
            participation={participation}
          />
        ))}
      </ContainerView>
    </PageContainer>
  );
}
