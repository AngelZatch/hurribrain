import {
  LiteAccountConversionSchema,
  useGetMe,
  useLiteAccountConversion,
} from "@/api/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { PageContainer } from "@/components/ui/PageContainer";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import ThemedText from "@/components/ui/ThemedText";
import { InputContainer } from "@/components/ui/InputContainer";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import ThemedButton from "@/components/ui/ThemedButton";
import AlertContainer from "@/components/ui/AlertContainer";

export default function AccountConversionScreen() {
  const { user, login } = useAuth();
  const { data: me, isLoading } = useGetMe(user!);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LiteAccountConversionSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LiteAccountConversionSchema) => {
    const tokens = await register({
      ...data,
      uuid: me!.uuid,
    });
    login(tokens.accessToken);
    router.replace("/");
  };

  if (!user || isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  const { mutateAsync: register, error: registerError } =
    useLiteAccountConversion(user!);

  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <TopNavigation />
      <BodyContainer>
        <ThemedText type="smallTitle">Bientôt arrivé !</ThemedText>
        <InputContainer>
          <ThemedText type="label">Adresse mail</ThemedText>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Ecris ici..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="text"
                textContentType="name"
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
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Ecris ici..."
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
            text="Cette adresse mail est déjà prise."
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
