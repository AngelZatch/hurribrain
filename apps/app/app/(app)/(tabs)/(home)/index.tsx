import { hasACurrentParticipation, ItemName } from "@/api/play.api";
import ItemButton from "@/components/ItemButton";
import ProfileBanner from "@/components/ProfileBanner";
import { PageContainer } from "@/components/ui/PageContainer";
import { useAuth } from "@/contexts/auth.context";
import { Link } from "expo-router";
import { Image, Text, Pressable, View } from "react-native";

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
      <View
        style={{
          flexDirection: "row",
          gap: 36,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {(
          [
            "Boost",
            "Darkness",
            "Super Darkness",
            "Half",
            "Hidden",
            "Hurry",
            "Judge",
            "Lock",
            "Super Quake",
            "Scramble",
            "Super Scramble",
            "Shield",
            "Turnaround",
            "Coin",
          ] satisfies ItemName[]
        ).map((item) => (
          <ItemButton
            key={item}
            participation={{
              uuid: "",
              score: 2,
              previousScore: 1,
              rank: 1,
              previousRank: 1,
              streak: 1,
              maxStreak: 1,
              itemCharge: 20,
              activeItem: item,
              statuses: [],
              user: "",
              game: {
                uuid: "",
              },
            }}
          />
        ))}
      </View>
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
