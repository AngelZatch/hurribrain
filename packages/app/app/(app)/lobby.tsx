import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

import JoinGameForm from "@/components/JoinGameForm";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedIconButton from "@/components/ui/ThemedIconButton";
import ThemedText from "@/components/ui/ThemedText";
import CreateGameForm from "@/components/CreateGameForm";

export default function Lobby() {
  const isPresented = router.canGoBack();

  const [lobbyState, setLobbyState] = useState<
    "quick" | "create" | "join" | null
  >(null);

  return (
    <PageContainer>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          height: 77,
          paddingHorizontal: 10,
          paddingVertical: 0,
          alignItems: "center",
          gap: 10,
          alignSelf: "stretch",
        }}
      >
        {lobbyState === null ? (
          <Link href={isPresented ? "../" : "/"} asChild>
            <ThemedIconButton icon="xmark" />
          </Link>
        ) : (
          <ThemedIconButton
            icon="chevron.left"
            onPress={() => setLobbyState(null)}
          />
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 16,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
          alignSelf: "stretch",
        }}
      >
        {lobbyState === null && (
          <>
            <Pressable
              style={[
                styles.playOption,
                {
                  backgroundImage:
                    "linear-gradient(180deg, #FC731D 0%, #F3985F 100%)",
                },
              ]}
              onPress={() => setLobbyState("quick")}
            >
              <IconSymbol name="play" size={32} color="white" />
              <View style={styles.playOptionDetailsContainer}>
                <ThemedText
                  style={{
                    fontSize: 20,
                    fontFamily: "Exo_700Bold",
                    color: "white",
                  }}
                >
                  Quick Play
                </ThemedText>
                <ThemedText
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontFamily: "Exo_400Regular",
                  }}
                >
                  Join or create a public game. 20 questions, up to 10 players.
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.playOption,
                {
                  backgroundImage:
                    "linear-gradient(180deg, #C746FA 0%, #762994 100%)",
                },
              ]}
              onPress={() => setLobbyState("create")}
            >
              <IconSymbol name="plus" size={32} color="white" />
              <View style={styles.playOptionDetailsContainer}>
                <ThemedText
                  style={{
                    fontSize: 20,
                    fontFamily: "Exo_700Bold",
                    color: "white",
                  }}
                >
                  Create Private Game
                </ThemedText>
                <ThemedText
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontFamily: "Exo_400Regular",
                  }}
                >
                  Create a private game to play with your friends.
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.playOption,
                {
                  backgroundImage:
                    "linear-gradient(180deg, #C746FA 0%, #762994 100%)",
                },
              ]}
              onPress={() => setLobbyState("join")}
            >
              <IconSymbol name="arrow.forward.square" size={32} color="white" />
              <View style={styles.playOptionDetailsContainer}>
                <ThemedText style={styles.playOptionText}>
                  Join Private Game
                </ThemedText>
                <ThemedText style={styles.playOptionDescription}>
                  Enter your game code and join your friends.
                </ThemedText>
              </View>
            </Pressable>
          </>
        )}
        {lobbyState === "quick" && <View>Quick Play</View>}
        {lobbyState === "create" && <CreateGameForm />}
        {lobbyState === "join" && <JoinGameForm />}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  playOption: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 130,
    width: "100%",
    borderRadius: 20,
  },
  playOptionDetailsContainer: {
    alignItems: "flex-start",
    flexShrink: 1,
    flexGrow: 1,
  },
  playOptionText: {
    fontSize: 20,
    fontFamily: "Exo_700Bold",
    color: "white",
  },
  playOptionDescription: {
    color: "white",
    fontSize: 14,
    fontFamily: "Exo_400Regular",
  },
});
