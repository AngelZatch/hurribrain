import { Image, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Link, useRouter } from "expo-router";
import ThemedButton from "./ui/ThemedButton";
import { useGetMeWithStats } from "@/api/auth.api";
import { Participation, useGetLeaderboard } from "@/api/play.api";
import { useAuth } from "@/contexts/auth.context";
import { Game } from "@/api/games.api";
import { ContainerView } from "./ui/ContainerView";
import LeaderboardItem from "./LeaderboardItem";
import PlayerRankDisplay from "./PlayerRankDisplay";
import PlayerScoreDisplay from "./PlayerScoreDisplay";
import ExperienceBar from "./ExperienceBar";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export default function GameRecap({
  game,
  participation,
}: {
  game: Game;
  participation: Participation;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const navigateToHome = () => {
    router.replace("/games");
    router.replace("/");
  };

  const { data: leaderboard, isLoading } = useGetLeaderboard(user!, game.uuid);
  const { data: me, isLoading: isLoadingStats } = useGetMeWithStats(user!);
  queryClient.invalidateQueries({ queryKey: ["my-participation"] });

  if (isLoading || isLoadingStats || !me || !leaderboard) {
    return <ThemedText>Chargement...</ThemedText>;
  }

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
        gap: 12,
        overflow: "hidden",
      }}
    >
      <ThemedText
        style={{
          fontSize: 32,
          fontFamily: "Exo_600SemiBold",
          paddingVertical: "2%",
          textAlign: "center",
        }}
      >
        La partie est terminée !
      </ThemedText>
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            aspectRatio: 1.7,
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <PlayerRankDisplay rank={participation.rank} fontSize={64} />
            <PlayerScoreDisplay score={participation.score} />
          </View>
          <View
            style={{
              width: "100%",
              aspectRatio: 1.3,
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "100%",
            }}
          >
            <Image
              source={{
                uri: "https://static.wikia.nocookie.net/finalfantasy/images/5/58/Theatrhythm_CC_Y%E2%80%99shtola.png",
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        </View>
        <ExperienceBar
          current={me.stats.experiencePoints}
          level={me.stats.level}
        />
      </View>
      <ContainerView
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "100%",
          flexDirection: "column",
          gap: 10,
          overflow: "scroll",
        }}
      >
        {isLoading && <ThemedText>Chargement...</ThemedText>}
        {leaderboard?.map((participation) => (
          <LeaderboardItem
            key={participation.uuid}
            participation={participation}
          />
        ))}
      </ContainerView>
      <View
        style={{
          gap: 8,
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {me.role === "lite" && (
          <View
            style={{
              gap: 4,
              flexDirection: "column",
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "100%",
            }}
          >
            <ThemedText
              style={{
                textAlign: "center",
                fontFamily: "Exo_800ExtraBold",
              }}
              glow
            >
              Garde ta progression !
            </ThemedText>
            <Link push href="/convert" asChild>
              <ThemedButton title="Créer un compte" type="secondary" />
            </Link>
          </View>
        )}
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "100%",
          }}
        >
          <ThemedButton
            title={me.role === "lite" ? "Quitter" : "Retourner à l'accueil"}
            onPress={me.role === "lite" ? logout : navigateToHome}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}
