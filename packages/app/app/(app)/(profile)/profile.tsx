import ExperienceBar from "@/components/ExperienceBar";
import ThemedText from "@/components/ui/ThemedText";
import { ContainerView } from "@/components/ui/ContainerView";
import { Divider } from "@/components/ui/Divider";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/auth.context";
import ThemedIconButton from "@/components/ui/ThemedIconButton";
import ThemedButton from "@/components/ui/ThemedButton";
import { useGetMeWithStats } from "@/api/auth.api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const { data, isLoading, isError } = useGetMeWithStats(user);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    logout();
  }

  console.log(data);

  const computeWinRate = (gamesPlayed: number, gamesWon: number) => {
    return gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
  };

  return (
    <PageContainer>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 10,
          paddingHorizontal: 0,
          paddingVertical: 10,
        }}
      >
        <Link href="/settings">
          <ThemedIconButton icon="gearshape.fill" title="Settings" />
        </Link>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
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
              uri: "https://img3.gelbooru.com/images/b0/2b/b02b35d59f9e6611ba6d5e19958690f0.jpg",
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
              {data?.name}
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
              current={data!.stats.experiencePoints}
              level={data!.stats.level}
            />
            <ThemedButton title="Edit Profile" size="medium" />
          </View>
        </ContainerView>
        <ContainerView
          style={{
            flexDirection: "column",
          }}
        >
          <Text style={styles.statSectionTitle}>Play Stats</Text>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Games played
            </ThemedText>
            <Text style={styles.statValue}>{data?.stats.gamesPlayed}</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              First game
            </ThemedText>
            <Text style={styles.statValue}>{data?.stats.firstGamePlayed}</Text>
          </View>
          <Divider orientation="horizontal" size="100%" />
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Games won
            </ThemedText>
            <Text style={styles.statValue}>{data?.stats.gamesWon}</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              First victory
            </ThemedText>
            <Text style={styles.statValue}>{data?.stats.firstGameWon}</Text>
          </View>
          <Divider orientation="horizontal" size="100%" />
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Win rate
            </ThemedText>
            <Text style={styles.statValue}>
              {computeWinRate(data!.stats.gamesWon, data!.stats.gamesPlayed)} %
            </Text>
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
          <Text style={styles.statSectionTitle}>Account Stats</Text>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Arrived
            </ThemedText>
            <Text style={styles.statValue}>{data?.createdAt}</Text>
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
    color: "#0A99FF",
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
    color: "#0A99FF",
  },
});
