import { Game, useGetPreJoinGame, useJoinGame } from "@/api/games.api";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth, User } from "@/contexts/auth.context";
import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Redirect,
  router,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function InviteScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { id: gameCode } = useLocalSearchParams<{ id: string }>();

  const {
    data: game,
    isLoading: prejoinGameLoading,
    isSuccess: prejoinGameSuccess,
    error: prejoinGameError,
  } = useGetPreJoinGame(user, gameCode);
  const {
    mutateAsync: joinGame,
    isPending: joinGameLoading,
    error: joinGameError,
  } = useJoinGame(user!);

  const actJoinGame = async (game: Game) => {
    await joinGame(game?.code);
    router.replace(`/play/${game?.uuid}`);
  };

  useEffect(() => {
    if (user && game && prejoinGameSuccess) {
      actJoinGame(game);
    }
  }, [user, game]);

  const router = useRouter();

  const authToJoin = (gameCode: string) => {
    router.push({
      pathname: "/login",
      params: { Redirect: `invite/${gameCode}` },
    });
  };

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <Link replace href="/" asChild>
            <ThemedButton
              icon="chevron.left"
              title="Accueil"
              type="secondary"
            />
          </Link>
        }
      />
      <BodyContainer>
        <View
          style={{
            gap: 12,
          }}
        >
          {prejoinGameLoading && (
            <ThemedText
              type="subtitle"
              style={{
                textAlign: "center",
              }}
            >
              Vérification du jeu en cours...
            </ThemedText>
          )}
          {prejoinGameError && (
            <>
              <ThemedText
                type="subtitle"
                style={{
                  textAlign: "center",
                }}
              >
                Vous ne pouvez pas rejoindre ce jeu.
              </ThemedText>
              <Link replace href="/" asChild>
                <ThemedButton title="Retourner à l'accueil" />
              </Link>
            </>
          )}
          {prejoinGameSuccess && !user && (
            <>
              <ThemedText
                type="subtitle"
                style={{
                  textAlign: "center",
                }}
              >
                Veuillez vous authentifier pour accéder au jeu.
              </ThemedText>
              <ThemedButton
                title="Me connecter"
                onPress={() => authToJoin(gameCode)}
              />
            </>
          )}
          {joinGameLoading && (
            <ThemedText type="subtitle" style={{ textAlign: "center" }}>
              Accès au jeu en cours...
            </ThemedText>
          )}
        </View>
      </BodyContainer>
    </PageContainer>
  );
}
