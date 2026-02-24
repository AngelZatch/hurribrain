import TopNavigation from "@/components/TopNavigation";
import { ContainerView } from "@/components/ui/ContainerView";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { Link } from "expo-router";

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
        }}
      >
        <ThemedText>Coucou</ThemedText>
      </ContainerView>
    </PageContainer>
  );
}
