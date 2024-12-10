import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { PageContainer } from "@/components/ui/PageContainer";
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
      <ThemedButton title={"Create my account"} type="secondary" fullWidth />
      <ThemedButton title={"Login"} fullWidth />
    </PageContainer>
  );
}
