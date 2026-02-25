import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { useForm, Controller } from "react-hook-form";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { InputContainer } from "@/components/ui/InputContainer";
import { useAuth } from "@/contexts/auth.context";
import { useAuthCheck, useAuthRecover, useLogin } from "@/api/auth.api";
import { router } from "expo-router";
import RecoverAccountModal from "@/components/RecoverAccountModal";
import { useState } from "react";
import { Modal } from "react-native";

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutateAsync: checkAuth } = useAuthCheck();
  const { mutateAsync: signIn, error: signInError } = useLogin();
  const { mutateAsync: recoverAuth, error: authRecoveryError } =
    useAuthRecover();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await checkAuth(data);

      if (result === 1) {
        setIsModalVisible(true);
      }

      if (result === 0) {
        const tokens = await signIn(data);
        login(tokens.accessToken);
        router.replace("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onRecover = async (data: FormData) => {
    console.log("ON RECOVER", data);
    try {
      const tokens = await recoverAuth(data);
      login(tokens.accessToken);
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <TopNavigation />
      <BodyContainer>
        <ThemedText type="smallTitle">Bon retour !</ThemedText>
        <InputContainer>
          <ThemedText type="label">Adresse mail</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Type here..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="email"
                textContentType="emailAddress"
              />
            )}
            name="email"
          />
        </InputContainer>
        {errors.email && <ThemedText>This field is required</ThemedText>}
        <InputContainer>
          <ThemedText type="label">Mot de Passe</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Type here..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="text"
                secureTextEntry
                textContentType="password"
              />
            )}
            name="password"
          />
        </InputContainer>
        {errors.password && <ThemedText>This field is required</ThemedText>}
        <ThemedButton
          title="Login"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
        {signInError && <ThemedText>{signInError.message}</ThemedText>}
      </BodyContainer>
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        visible={isModalVisible}
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <RecoverAccountModal
          onRequestCancel={() => setIsModalVisible(false)}
          onRequestProceed={handleSubmit(onRecover)}
        />
      </Modal>
    </PageContainer>
  );
}
