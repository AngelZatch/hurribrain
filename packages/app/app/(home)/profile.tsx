import ExperienceBar from "@/components/ExperienceBar";
import ThemedText from "@/components/ThemedText";
import { ContainerView } from "@/components/ui/ContainerView";
import { Divider } from "@/components/ui/Divider";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";
import { View, Text, Image, Button, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <PageContainer>
      <View>
        <Link href="/settings">
          <Button title="Settings"></Button>
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
              Na'el
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
            <ExperienceBar current={40} level={2} />
            <Button title="Edit Profile" />
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
            <Text style={styles.statValue}>14</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Games won
            </ThemedText>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              Games played
            </ThemedText>
            <Text style={styles.statValue}>85.71%</Text>
          </View>
          <Divider orientation="horizontal" size="100%" />
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
          </View>
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
            <Text style={styles.statValue}>Sept. 14, 2024</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              First game
            </ThemedText>
            <Text style={styles.statValue}>Sept. 14, 2024</Text>
          </View>
          <View style={styles.statRow}>
            <ThemedText style={styles.statTitle} colorType="secondaryText">
              First victory
            </ThemedText>
            <Text style={styles.statValue}>Sept. 17, 2024</Text>
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
