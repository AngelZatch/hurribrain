import ExperienceBar from "@/components/ExperienceBar";
import { ThemedText } from "@/components/ThemedText";
import { ContainerView } from "@/components/ui/ContainerView";
import { Divider } from "@/components/ui/Divider";
import { PageContainer } from "@/components/ui/PageContainer";
import { View, Text, Image, Button, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <PageContainer>
      <ContainerView>
        <Image
          source={{
            uri: "https://img3.gelbooru.com/images/b0/2b/b02b35d59f9e6611ba6d5e19958690f0.jpg",
          }}
          style={{
            aspectRatio: 1,
            flexGrow: 2,
            flexShrink: 0,
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
          <Text style={styles.statTitle}>Games played</Text>
          <Text style={styles.statValue}>14</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Games won</Text>
          <Text style={styles.statValue}>12</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Games played</Text>
          <Text style={styles.statValue}>85.71%</Text>
        </View>
        <Divider />
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Question asked</Text>
          <Text style={styles.statValue}>280</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Correct answers</Text>
          <Text style={styles.statValue}>217</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Win rate</Text>
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
          <Text style={styles.statTitle}>Arrived</Text>
          <Text style={styles.statValue}>Sept. 14, 2024</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>First game</Text>
          <Text style={styles.statValue}>Sept. 14, 2024</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>First victory</Text>
          <Text style={styles.statValue}>Sept. 17, 2024</Text>
        </View>
      </ContainerView>
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
