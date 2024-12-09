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
      <ThemedText
        type="title"
        style={{
          fontSize: 48,
          fontFamily: "Exo_900Black",
        }}
      >
        Hurribrain
      </ThemedText>
      <ThemedText type="subtitle">Come test your knowledge!</ThemedText>
      <ThemedButton title={"Create my account"} />
      <ThemedButton title={"Login"} />
    </PageContainer>
  );
}
