import { Turn, useGetGame } from "@/api/games.api";
import { useAuth } from "@/contexts/auth.context";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import GameLobby from "@/components/GameLobby";
import { io, Socket } from "socket.io-client";
import ActiveGame from "@/components/ActiveGame";

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();
  const socket = useRef<Socket>();

  const { data, isLoading, error } = useGetGame(user!, gameId);
  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null);

  useEffect(() => {
    if (!data?.uuid) {
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
        socket.current?.emit("game:join", data.uuid);
      })
      .on("game:joined", () => {
        console.log("game:joined");
        socket.current?.emit("sync:request", data.uuid);
      })
      .on("game:updated", () => {
        console.log("game:updated");
      })
      .on("turn:current", (turn: Turn) => {
        console.log("TURN RECEIVED", turn);
        setCurrentTurn(turn);
      });

    // Clean up
    return () => {
      socket.current?.off("connect");
      socket.current?.off("turn:change");
      socket.current?.disconnect();
    };
  }, [data?.uuid]);

  if (!data) {
    return null;
  }

  return (
    <PageContainer>
      <TopNavigation
        topLabel={data?.isPrivate ? "Partie Privée" : "Partie Rapide"}
        subLabel={data?.code}
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
        {!data.startedAt && <GameLobby game={data!} />}
        {data.startedAt && currentTurn && (
          <ActiveGame currentTurn={currentTurn} />
        )}
      </View>
    </PageContainer>
  );
}
