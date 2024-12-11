import { PageContainer } from "@/components/ui/PageContainer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { useForm, Controller } from "react-hook-form";
import ThemedTextInput from "@/components/ui/ThemedTextInput";

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <PageContainer
      style={{
        justifyContent: "center",
      }}
    >
      <TopNavigation />
      <BodyContainer>
        <ThemedText type="smallTitle">Welcome back!</ThemedText>
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
        <ThemedButton
          title={"Login"}
          fullWidth
          onPress={handleSubmit(onSubmit)}
        />
      </BodyContainer>
    </PageContainer>
  );
}
