import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";

export default function LoginScreen() {
  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <ThemedText type="title">Login</ThemedText>
      <ThemedButton title={"Login"} fullWidth />
    </PageContainer>
  );
}
