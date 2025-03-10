import { useAuth } from "@/contexts/auth.context";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import GameLobby from "@/components/GameLobby";
import { io, Socket } from "socket.io-client";
import ActiveGame from "@/components/ActiveGame";
import { useQueryClient } from "@tanstack/react-query";
import ThemedIconButton from "@/components/ui/ThemedIconButton";
import { useGetGame } from "@/api/games.api";
import { PlayableTurn, PlayedTurn } from "@/api/play.api";
import GameRecap from "@/components/GameRecap";

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();
  const socket = useRef<Socket>();

  const { data: game, isLoading, error } = useGetGame(user!, gameId);
  const [currentTurn, setCurrentTurn] = useState<
    PlayableTurn | PlayedTurn | null
  >(null);

  useEffect(() => {
    if (!game?.uuid) {
      return;
    }

    socket.current = io("http://localhost:8080", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 400,
      reconnectionAttempts: 10,
    })
      .on("connect", () => {
        console.log("connected");
        socket.current?.emit("game:join", game.uuid);
      })
      .on("game:joined", () => {
        console.log("game:joined");
        socket.current?.emit("sync:request", game.uuid);
      })
      .on("game:updated", () => {
        console.log("game:updated");
        queryClient.invalidateQueries({
          queryKey: ["games", gameId],
        });
      })
      .on("turn:current", (turn: PlayableTurn | PlayedTurn | null) => {
        queryClient.invalidateQueries({
          queryKey: ["my-participation", gameId],
        });
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
      socket.current?.off("connect");
      socket.current?.off("turn:change");
      socket.current?.disconnect();
    };
  }, [game?.uuid]);

  if (!game) {
    return null;
  }

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <Link replace href="/games" asChild>
            <ThemedIconButton icon="chevron.left" />
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
            <ThemedIconButton
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
          <ActiveGame currentTurn={currentTurn} />
        )}
        {game.finishedAt && <GameRecap />}
      </View>
    </PageContainer>
  );
}
