import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { Link } from "expo-router";
import { View } from "react-native";

export default function SecurityAndConnectionScreen() {
  return (
    <PageContainer>
      <TopNavigation
        leftElement={
          <Link href={"../"} asChild>
            <ThemedButton
              icon="chevron.left"
              size="large"
              title=""
              type="secondary"
            />
          </Link>
        }
        topLabel="Paramètres"
        subLabel="Sécurité et Connexion"
      />
      <ContainerView
        style={{
          flexDirection: "column",
          flex: 1,
        }}
      >
        <ThemedText type="settingsSectionTitle">Zone Dangereuse</ThemedText>
        <View>
          <ThemedText type="label">Suppression de Compte</ThemedText>
          <ThemedText type="helper">
            Supprime définitivement ton compte et toutes les données associées.
            Tu seras retiré.e de toutes les parties en cours. Cette action est
            irréversible.
          </ThemedText>
          <ThemedButton title="Suppression de compte" fullWidth type="danger" />
        </View>
      </ContainerView>
    </PageContainer>
  );
}
