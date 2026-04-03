import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";

export default function WelcomeScreen() {
  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <ThemedText type="title">Hurribrain</ThemedText>
      <ThemedText type="subtitle">Venez tester vos connaissances !</ThemedText>
      <Link push href="/register" asChild style={{ width: "100%" }}>
        <ThemedButton
          title={"Créer mon compte"}
          type="secondary"
          fullWidth
          disabled={false}
        />
      </Link>
      <Link push href="/login" asChild style={{ width: "100%" }}>
        <ThemedButton
          title={"Me connecter"}
          type="primary"
          size="large"
          fullWidth
          disabled={false}
        />
      </Link>
    </PageContainer>
  );
}
