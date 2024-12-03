import ExperienceBar from "@/components/ExperienceBar";
import { ThemedText } from "@/components/ThemedText";
import { PageContainer } from "@/components/ui/PageContainer";
import { View, Text, Image } from "react-native";

export default function ProfileScreen() {
  return (
    <PageContainer>
      <Text>Profile</Text>
      <View
        style={{
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: "auto",
          width: "100%",
          flexDirection: "row",
          gap: 10,
          padding: 16,
          backgroundColor: "#00000033",
          borderRadius: 20,
        }}
      >
        <Image
          source={{
            uri: "https://img3.gelbooru.com/images/b0/2b/b02b35d59f9e6611ba6d5e19958690f0.jpg",
          }}
          style={{
            aspectRatio: 1,
            height: 154,
            width: 154,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
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
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              flexGrow: 1,
              flexShrink: 0,
              flexBasis: "auto",
              gap: 10,
            }}
          >
            <ThemedText
              style={{
                fontFamily: "Exo_400Regular_Italic",
              }}
            >
              Lv. 1
            </ThemedText>
            <ExperienceBar current={40} level={2} />
          </View>
        </View>
      </View>
    </PageContainer>
  );
}
