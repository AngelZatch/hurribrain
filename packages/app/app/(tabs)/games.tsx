import ProfileBanner from "@/components/ProfileBanner";
import { PageContainer } from "@/components/ui/PageContainer";
import { View, Text } from "react-native";

export default function GamesScreen() {
  return (
    <PageContainer>
      <ProfileBanner />
      <View style={{ flex: 1 }}>
        <Text>Games</Text>
      </View>
    </PageContainer>
  );
}
