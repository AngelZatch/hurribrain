import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import { useAuth } from "@/contexts/auth.context";
import { Text } from "react-native";

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <PageContainer>
      <ContainerView>
        <Text>Settings</Text>
        <ThemedButton title="Logout" onPress={logout} />
      </ContainerView>
    </PageContainer>
  );
}
