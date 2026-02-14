import { useAuth } from "@/contexts/auth.context";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import GameLobby from "@/components/GameLobby";
import { socket } from "@/contexts/socket";
import ActiveGame from "@/components/ActiveGame";
import { useQueryClient } from "@tanstack/react-query";
import { useGetGame } from "@/api/games.api";
import { Participation, PlayableTurn, PlayedTurn } from "@/api/play.api";
import GameRecap from "@/components/GameRecap";
import ThemedText from "@/components/ui/ThemedText";
import { useGetMe } from "@/api/auth.api";
import ThemedButton from "@/components/ui/ThemedButton";

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();

  // Getting "long-term" data for the game (game info and logged user)
  const { data: game, isLoading, error } = useGetGame(user!, gameId);
  const { data: me } = useGetMe(user!);

  // Working states for the game (current turn and participation)
  const [currentTurn, setCurrentTurn] = useState<
    PlayableTurn | PlayedTurn | null
  >(null);
  const [participation, setParticipation] = useState<Participation | null>(
    null,
  );

  useEffect(() => {
    if (!game?.uuid || !me) {
      return;
    }

    socket.connect();

    socket.on("connect", () => {
      socket.emit("game:join", { game: game.uuid, user: me!.uuid });
    });

    socket.on("game:joined", () => {
      socket.emit("sync:request", game.uuid);
    });

    socket.on("game:updated", () => {
      console.log("game:updated");
      queryClient.invalidateQueries({
        queryKey: ["games", gameId],
      });
    });

    /**
     * When a participation is updated (e.g. a player joins, leaves, answers a question, etc.), the server emits the
     * new participation to the concerned player. We listen to this event to update the participation data in
     * real-time and reflect it in the UI (e.g. update the player's score, show that they answered, etc.)
     */
    socket.on("participation:updated", (participation: Participation) => {
      if (!participation || participation.user !== me?.uuid) {
        return;
      }

      setParticipation(participation);
    });

    // When the current turn changes, the server emits the new turn to all participants
    socket.on("turn:current", (turn: PlayableTurn | PlayedTurn | null) => {
      if (turn) {
        const choices = turn.question.choices;
        for (let i = choices.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        turn.question.choices = choices;
      }
      setCurrentTurn(turn);
    });

    // Clean up
    return () => {
      socket.off("turn:current");
      socket.off("participation:updated");
      socket.off("game:updated");
      socket.off("game:joined");
      socket.off("connect");
      socket.disconnect();
    };
  }, [game?.uuid, me]);

  if (!game || !me || !participation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText>Chargement...</ThemedText>
      </View>
    );
  }

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <Link replace href="/games" asChild>
            <ThemedButton icon="chevron.left" title="" type="secondary" />
          </Link>
        }
        topLabel={game?.isPrivate ? "Partie Privée" : "Partie Rapide"}
        subLabel={game?.code}
        rightElement={
          <Link
            href={{
              pathname: "/(app)/(tabs)/(games)/play/leaderboard",
              params: { id: gameId },
            }}
            asChild
          >
            <ThemedButton
              title=""
              type="secondary"
              onPress={() => {
                console.log("PRESSED");
              }}
              icon="person.fill"
            />
          </Link>
        }
      />
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
        {!game.startedAt && <GameLobby game={game!} />}
        {game.startedAt && !game.finishedAt && currentTurn && (
          <ActiveGame currentTurn={currentTurn} participation={participation} />
        )}
        {game.finishedAt && <GameRecap />}
      </View>
    </PageContainer>
  );
}
