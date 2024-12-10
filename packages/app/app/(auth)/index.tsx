import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { PageContainer } from "@/components/ui/PageContainer";
import { Link } from "expo-router";
import { Pressable } from "react-native";

export default function WelcomeScreen() {
  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <ThemedText type="title">Hurribrain</ThemedText>
      <ThemedText type="subtitle">Come test your knowledge!</ThemedText>
      <ThemedButton title={"Create my account"} type="secondary" fullWidth />
      <Link href="/login" asChild>
        <Pressable style={{ width: "100%" }}>
          <ThemedButton title={"Login"} fullWidth />
        </Pressable>
      </Link>
    </PageContainer>
  );
}
