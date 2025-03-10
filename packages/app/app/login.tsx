import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { useForm, Controller } from "react-hook-form";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { InputContainer } from "@/components/ui/InputContainer";
import { useAuth } from "@/contexts/auth.context";
import { useLogin } from "@/api/auth.api";
import { router } from "expo-router";

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { mutateAsync: signIn, error } = useLogin();
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
      const tokens = await signIn(data);
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
        <ThemedText type="smallTitle">Welcome back!</ThemedText>
        <InputContainer>
          <ThemedText type="label">Email address</ThemedText>
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
          <ThemedText type="label">Password</ThemedText>
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
        {error && <ThemedText>{error.message}</ThemedText>}
      </BodyContainer>
    </PageContainer>
  );
}
