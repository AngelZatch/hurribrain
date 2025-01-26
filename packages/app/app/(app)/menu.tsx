import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

import JoinGameForm from "@/components/JoinGameForm";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedIconButton from "@/components/ui/ThemedIconButton";
import ThemedText from "@/components/ui/ThemedText";
import CreateGameForm from "@/components/CreateGameForm";
import TopNavigation from "@/components/TopNavigation";

export default function Lobby() {
  const isPresented = router.canGoBack();

  const [lobbyState, setLobbyState] = useState<
    "quick" | "create" | "join" | null
  >(null);

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          lobbyState === null ? (
            <Link href={isPresented ? "../" : "/"} asChild>
              <ThemedIconButton icon="xmark" />
            </Link>
          ) : (
            <ThemedIconButton
              icon="chevron.left"
              onPress={() => setLobbyState(null)}
            />
          )
        }
      />
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
                <ThemedText style={styles.playOptionText}>
                  Partie Rapide
                </ThemedText>
                <ThemedText style={styles.playOptionDescription}>
                  Rejoins ou crée une partie publique. 20 questions, jusqu’à 10
                  joueurs.
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
                <ThemedText style={styles.playOptionText}>
                  Créer une Partie Privée
                </ThemedText>
                <ThemedText style={styles.playOptionDescription}>
                  Crée une partie privée pour jouer avec tes amis.
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
                  Rejoindre une Partie Privée
                </ThemedText>
                <ThemedText style={styles.playOptionDescription}>
                  Entre un code jeu et rejoins tes amis.
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
    color: "#FFFFFFB2",
    fontSize: 14,
    fontFamily: "Exo_700Bold",
  },
});
