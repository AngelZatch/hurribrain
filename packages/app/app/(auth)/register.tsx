import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
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
        <ThemedText type="smallTitle">Welcome!</ThemedText>
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
        {errors.email && <ThemedText>This field is required</ThemedText>}
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
        {errors.password && <ThemedText>This field is required</ThemedText>}
        <ThemedButton
          title="Register"
          onPress={handleSubmit(onSubmit)}
          fullWidth
        />
      </BodyContainer>
    </PageContainer>
  );
}
