import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedText from "@/components/ui/ThemedText";
import { Link, router } from "expo-router";
import { Animated, Button, Pressable, View, StyleSheet } from "react-native";

export default function Lobby() {
  const isPresented = router.canGoBack();

  console.log(isPresented);

  return (
    <PageContainer>
      {isPresented && <Link href="../">Dismiss</Link>}
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
        <Pressable
          style={[
            styles.playOption,
            {
              backgroundImage:
                "linear-gradient(180deg, #FC731D 0%, #F3985F 100%)",
            },
          ]}
        >
          <IconSymbol name="star.fill" size={32} color="white" />
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
        >
          <IconSymbol name="input" size={32} color="white" />
          <View style={styles.playOptionDetailsContainer}>
            <ThemedText style={styles.playOptionText}>
              Join Private Game
            </ThemedText>
            <ThemedText style={styles.playOptionDescription}>
              Enter your game code and join your friends.
            </ThemedText>
          </View>
        </Pressable>
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
