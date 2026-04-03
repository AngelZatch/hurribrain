import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { Controller, useForm } from "react-hook-form";
import { InputContainer } from "@/components/ui/InputContainer";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth.context";
import { useRegister } from "@/api/auth.api";
import { router } from "expo-router";
import AlertContainer from "@/components/ui/AlertContainer";

type FormData = {
  email: string;
  name: string;
  password: string;
};

export default function RegisterScreen() {
  const { mutateAsync: register, error: registerError } = useRegister();
  const { login } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const tokens = await register(data);
    login(tokens.accessToken);
    router.replace("/");
  };

  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <TopNavigation />
      <BodyContainer>
        <ThemedText type="smallTitle">Bienvenue !</ThemedText>
        <InputContainer>
          <ThemedText type="label">Nom d'utilisateur</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
              maxLength: 30,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Ecrire ici..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="text"
                textContentType="name"
              />
            )}
            name="name"
          />
        </InputContainer>
        {errors.name && <ThemedText>Ce champ est requis.</ThemedText>}
        <InputContainer>
          <ThemedText type="label">Adresse mail</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Ecrire ici..."
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
        {errors.email && <ThemedText>Ce champ est requis.</ThemedText>}
        <InputContainer>
          <ThemedText type="label">Mot de passe</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Ecrire ici..."
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
        {errors.password && <ThemedText>Ce champ est requis.</ThemedText>}
        {registerError && (
          <AlertContainer
            type="error"
            text="Cet utilisateur et/ou adresse mail est déjà prise."
          />
        )}
        <ThemedButton
          title="Créer mon compte"
          onPress={handleSubmit(onSubmit)}
          fullWidth
          disabled={!isValid}
        />
      </BodyContainer>
    </PageContainer>
  );
}
