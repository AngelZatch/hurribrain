import { hasACurrentParticipation } from "@/api/play.api";
import ProfileBanner from "@/components/ProfileBanner";
import { PageContainer } from "@/components/ui/PageContainer";
import { useAuth } from "@/contexts/auth.context";
import { Link } from "expo-router";
import { Image, Text, Pressable } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();

  const { data: participation } = hasACurrentParticipation(user!);

  return (
    <PageContainer>
      <ProfileBanner />
      <Image
        source={{
          uri: "https://static.wikia.nocookie.net/finalfantasy/images/5/58/Theatrhythm_CC_Y%E2%80%99shtola.png",
        }}
        style={{
          width: "100%",
          flex: 1,
        }}
      />
      <Link
        href={participation ? `/play/${participation!.game!.uuid}` : "/lobby"}
        style={{ width: "100%" }}
        asChild
      >
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
            {participation ? "Reprendre" : "Jouer"}
          </Text>
        </Pressable>
      </Link>
    </PageContainer>
  );
}
