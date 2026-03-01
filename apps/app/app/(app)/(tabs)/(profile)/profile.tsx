import ExperienceBar from "@/components/ExperienceBar";
import ThemedText from "@/components/ui/ThemedText";
import { ContainerView } from "@/components/ui/ContainerView";
import { Divider } from "@/components/ui/Divider";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/auth.context";
import ThemedButton from "@/components/ui/ThemedButton";
import { useGetMeWithStats } from "@/api/auth.api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const { data, isLoading, isError } = useGetMeWithStats(user);

  if (!data || isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    logout();
  }

  const computeWinRate = (gamesPlayed: number, gamesWon: number) => {
    return gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(2) : 0;
  };

  return (
    <PageContainer>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 6,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
          alignSelf: "stretch",
          overflow: "scroll",
        }}
      >
        <ContainerView>
          <Image
            source={{
              uri: "https://static.wikia.nocookie.net/finalfantasy/images/5/58/Theatrhythm_CC_Y%E2%80%99shtola.png",
            }}
            style={{
              aspectRatio: 1,
              width: "33%",
              flexBasis: "auto",
              borderRadius: 10,
            }}
          />
          <View
            style={{
              flexGrow: 5,
              flexShrink: 1,
              flexBasis: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <ThemedText
              style={{
                fontSize: 20,
                fontFamily: "Exo_700Bold",
              }}
            >
              {data.name}
            </ThemedText>
            <Text
              style={{
                fontFamily: "Exo_500Medium",
                fontSize: 16,
                color: "#FBA672",
              }}
            >
              Master of the Quiz
            </Text>
            <ExperienceBar
              current={data.stats.experiencePoints}
              level={data.stats.level}
            />
          </View>
        </ContainerView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: 0,
            paddingVertical: 10,
            width: "100%",
          }}
        >
          <ThemedButton title="Modifier le Profil" size="medium" fullWidth />
          <Link href="/settings" asChild>
            <ThemedButton
              icon="gearshape.fill"
              size="large"
              title=""
              type="secondary"
            />
          </Link>
        </View>
        <ContainerView
          style={{
            flexDirection: "column",
          }}
        >
          <ThemedText style={styles.statSectionTitle} colorType="main">
            Statistiques de Jeu
          </ThemedText>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Parties jouées
            </ThemedText>
            <ThemedText style={styles.statValue} colorType="main">
              {data.stats.gamesPlayed}
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Première partie
            </ThemedText>
            <ThemedText style={styles.statValue} colorType="main">
              {new Date(data.stats.firstGamePlayed).toLocaleDateString()}
            </ThemedText>
          </View>
          <Divider orientation="horizontal" size="100%" />
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Parties gagnées
            </ThemedText>
            <ThemedText style={styles.statValue} colorType="main">
              {data.stats.gamesWon}
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Première victoire
            </ThemedText>
            <ThemedText style={styles.statValue} colorType="main">
              {new Date(data.stats.firstGameWon).toLocaleDateString()}
            </ThemedText>
          </View>
          <Divider orientation="horizontal" size="100%" />
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Taux de victoire
            </ThemedText>
            <ThemedText style={styles.statValue} colorType="main">
              {computeWinRate(data.stats.gamesPlayed, data.stats.gamesWon)} %
            </ThemedText>
          </View>
          {/* 
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Question asked
            </ThemedText>
            <Text style={styles.statValue}>280</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Correct answers
            </ThemedText>
            <Text style={styles.statValue}>217</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Win rate
            </ThemedText>
            <Text style={styles.statValue}>77.50%</Text>
          </View> */}
        </ContainerView>
        <ContainerView
          style={{
            flexDirection: "column",
          }}
        >
          <ThemedText style={styles.statSectionTitle} colorType="main">
            Statistiques de Compte
          </ThemedText>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Arrivée
            </ThemedText>
            <ThemedText style={styles.statValue} colorType="main">
              {new Date(data.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>
        </ContainerView>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  statSectionTitle: {
    fontSize: 24,
    fontFamily: "Exo_600Semibold",
    alignSelf: "center",
  },
  statRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statTitle: {
    fontSize: 16,
    fontFamily: "Exo_400Regular",
    // color: "#0F2969",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Exo_600Semibold",
  },
});
