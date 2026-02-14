import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import { useAuth } from "@/contexts/auth.context";
import { Link } from "expo-router";
import { Text } from "react-native";

export default function Settings() {
  const { logout } = useAuth();

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <Link href={"/"} asChild>
            <ThemedButton icon="xmark" size="large" title="" type="secondary" />
          </Link>
        }
      />
      <ContainerView>
        <Text>Settings</Text>
        <ThemedButton title="Logout" onPress={logout} />
      </ContainerView>
    </PageContainer>
  );
}
