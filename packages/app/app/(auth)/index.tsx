import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";
import { Button, Pressable, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <ThemedText type="title">Hurribrain</ThemedText>
      <ThemedText type="subtitle">Come test your knowledge!</ThemedText>
      <Link push href="/register" asChild style={{ width: "100%" }}>
        <ThemedButton title={"Create my account"} type="secondary" fullWidth />
      </Link>
      <Link push href="/login" asChild style={{ width: "100%" }}>
        <ThemedButton title={"Login"} fullWidth type="primary" size="large" />
      </Link>
    </PageContainer>
  );
}
