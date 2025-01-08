import { Text, View } from "react-native";
import ExperienceBar from "./ExperienceBar";
import Avatar from "./Avatar";

import ThemedText from "./ui/ThemedText";
import CoinCount from "./CoinCount";
import { Divider } from "./ui/Divider";
import { useAuth } from "@/contexts/auth.context";
import { useGetMeWithStats } from "@/api/auth.api";

export default function ProfileBanner() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const { data, isLoading, isError } = useGetMeWithStats(user);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        maxHeight: 82,
        width: "100%",
        gap: 10,
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: "row",
      }}
    >
      <Avatar />
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        <ThemedText
          style={{
            fontSize: 16,
            fontFamily: "Exo_700Bold",
          }}
        >
          {data?.name}
        </ThemedText>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            paddingVertical: 3,
            alignItems: "center",
          }}
        >
          <ExperienceBar
            current={data!.stats.experiencePoints}
            level={data!.stats.level}
          />
          <Divider orientation="vertical" size={15} />
          <CoinCount count={138} />
        </View>
      </View>
    </View>
  );
}
