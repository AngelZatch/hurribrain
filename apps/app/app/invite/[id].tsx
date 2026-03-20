import { useLiteRegister } from "@/api/auth.api";
import { Game, useGetPreJoinGame, useJoinGame } from "@/api/games.api";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { Divider } from "@/components/ui/Divider";
import { InputContainer } from "@/components/ui/InputContainer";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
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
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function InviteScreen() {
  const queryClient = useQueryClient();
  const { user, login } = useAuth();
  const { id: gameCode } = useLocalSearchParams<{ id: string }>();

  // Endpoints
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
  const { mutateAsync: liteRegister } = useLiteRegister();

  // Lite Registration form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (data: { name: string }) => {
    const tokens = await liteRegister(data);
    login(tokens.accessToken);
    actJoinGame(game!);
  };

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
            width: "100%",
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
              <View style={{ width: "100%", gap: 8 }}>
                <InputContainer>
                  <ThemedText type="label">Entrez un nom :</ThemedText>
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ThemedTextInput
                        placeholder="Entrez ici..."
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputMode="text"
                        textContentType="name"
                      />
                    )}
                    name="name"
                  />
                </InputContainer>
                <ThemedButton
                  title="Rejoindre le jeu"
                  onPress={handleSubmit(onSubmit)}
                  fullWidth
                  disabled={!isValid}
                />
              </View>
              <Divider orientation="horizontal" size="100%" />
              <ThemedText
                type="subtitle"
                style={{
                  textAlign: "center",
                }}
              >
                Déjà un compte ?
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
