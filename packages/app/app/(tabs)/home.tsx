import { BackgroundView } from "@/components/BackgroundView";
import ProfileBanner from "@/components/ProfileBanner";
import { Image, View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <BackgroundView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        padding: 20,
      }}
    >
      <ProfileBanner />
      <Image
        source={{
          uri: "https://img3.gelbooru.com/images/b0/2b/b02b35d59f9e6611ba6d5e19958690f0.jpg",
        }}
        style={{
          width: "100%",
          flex: 1,
        }}
      />
      <Pressable
        style={{
          width: "100%",
          maxHeight: 135,
          minHeight: 135,
          backgroundImage: "linear-gradient(#3C73FF, #3AF2F8)",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontFamily: "Exo_700Bold",
          }}
        >
          Play
        </Text>
      </Pressable>
    </BackgroundView>
  );
}
