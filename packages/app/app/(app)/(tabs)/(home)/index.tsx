import ProfileBanner from "@/components/ProfileBanner";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";
import { Image, Text, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <PageContainer>
      <ProfileBanner />
      <Image
        source={{
          uri: "https://images.squarespace-cdn.com/content/v1/5c39e499697a984f8b163b5c/1689188407060-92YLPDG9ZPJ2CFWQIUIN/03+Y%27shtola.jpg",
        }}
        style={{
          width: "100%",
          flex: 1,
        }}
      />
      <Link href="/lobby" style={{ width: "100%" }} asChild>
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
              fontSize: 32,
              fontFamily: "Exo_700Bold",
            }}
          >
            Play
          </Text>
        </Pressable>
      </Link>
    </PageContainer>
  );
}
