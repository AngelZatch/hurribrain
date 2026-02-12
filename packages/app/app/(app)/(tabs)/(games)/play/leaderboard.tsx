import { useGetLeaderboard } from "@/api/play.api";
import LeaderboardItem from "@/components/LeaderboardItem";
import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
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
          <Link href={isPresented ? "../" : "/"} asChild>
            <ThemedButton icon="xmark" title="" size="large" type="secondary" />
          </Link>
        }
      />
      <ContainerView
        style={{
          flexDirection: "column",
          gap: 10,
          flexGrow: 1,
        }}
      >
        {isLoading && <ThemedText>Loading...</ThemedText>}
        {leaderboard?.map((participation) => (
          <LeaderboardItem
            key={participation.uuid}
            participation={participation}
          />
        ))}
      </ContainerView>
    </PageContainer>
  );
}
