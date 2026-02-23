import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { Divider } from "@/components/ui/Divider";
import { PageContainer } from "@/components/ui/PageContainer";
import SettingsOption from "@/components/ui/SettingsOption";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/auth.context";
import { Link } from "expo-router";

export default function Settings() {
  const { logout } = useAuth();

  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <Link href={"../"} asChild>
            <ThemedButton icon="xmark" size="large" title="" type="secondary" />
          </Link>
        }
        topLabel="Paramètres"
      />
      <ContainerView
        style={{
          flexDirection: "column",
        }}
      >
        <ThemedText type="settingsSectionTitle">Compte</ThemedText>
        <SettingsOption
          icon="shield.fill"
          label="Sécurité et Connexion"
          onClick={() => {}}
        />
        <Divider orientation="horizontal" size="auto" />
        <SettingsOption
          icon="logout"
          label="Déconnexion"
          onClick={() => {
            logout();
          }}
          toNextPage={false}
        />
      </ContainerView>
    </PageContainer>
  );
}
