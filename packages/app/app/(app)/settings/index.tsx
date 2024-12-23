import { Text } from "react-native";
import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";

export function SettingsScreen() {
  return (
    <PageContainer>
      <ContainerView>
        <Text>Settings</Text>
      </ContainerView>
    </PageContainer>
  );
}
