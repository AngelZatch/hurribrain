import { useGetMe } from "@/api/auth.api";
import { useGetGame } from "@/api/games.api";
import { useEndGame, useGetLeaderboard } from "@/api/play.api";
import DifficultyChip from "@/components/DifficultyChip";
import LeaderboardItem from "@/components/LeaderboardItem";
import TagChip from "@/components/TagChip";
import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/auth.context";
import { Link, router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function Leaderboard() {
  const isPresented = router.canGoBack();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();

  if (!user) {
    return null;
  }

  const { data: leaderboard, isLoading: isLoadingLeaderboard } =
    useGetLeaderboard(user, gameId);
  const { data: game, isLoading: isLoadingGame } = useGetGame(user, gameId);
  const { data: me, isLoading: isLoadingMe } = useGetMe(user);

  const { mutateAsync: endGame } = useEndGame(user);

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
        {isLoadingLeaderboard && <ThemedText>Loading...</ThemedText>}
        {leaderboard?.map((participation) => (
          <LeaderboardItem
            key={participation.uuid}
            participation={participation}
          />
        ))}
      </ContainerView>
      <ContainerView
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
      >
        {isLoadingGame && <ThemedText>Chargement...</ThemedText>}
        {game && (
          <>
            <ThemedText
              style={{
                fontSize: 20,
                fontFamily: "Exo_600SemiBold",
                lineHeight: 21,
                color: "#EC9D27",
              }}
            >
              Règles de la partie
            </ThemedText>
            <View style={styles.ruleContainer}>
              <ThemedText>Thèmes</ThemedText>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                  flexShrink: 1,
                  justifyContent: "flex-end",
                }}
              >
                {game.tags.map((tag) => (
                  <TagChip key={tag.uuid} text={tag.name} active />
                ))}
              </View>
            </View>
            <View style={styles.ruleContainer}>
              <ThemedText>Difficulté</ThemedText>
              <DifficultyChip difficulty={game.difficulty} fullSize />
            </View>
            <View style={styles.ruleContainer}>
              <ThemedText>Durée</ThemedText>
              <ThemedText>{game.length} questions</ThemedText>
            </View>
          </>
        )}
        {me?.uuid === game?.creator?.uuid && (
          <ThemedButton
            title="Mettre fin au jeu"
            onPress={() => endGame(game!.uuid)}
            disabled={game?.startedAt === null || game?.finishedAt !== null}
            type="danger"
          />
        )}
      </ContainerView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  ruleContainer: {
    minHeight: 50,
    padding: 10,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
