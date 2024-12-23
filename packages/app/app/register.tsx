import ThemedButton from "@/components/ui/ThemedButton";
import ThemedText from "@/components/ui/ThemedText";
import TopNavigation from "@/components/TopNavigation";
import { BodyContainer } from "@/components/ui/BodyContainer";
import { PageContainer } from "@/components/ui/PageContainer";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { Controller, useForm } from "react-hook-form";
import { InputContainer } from "@/components/ui/InputContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth.context";
import { useRegister } from "@/api/auth.api";
import { router } from "expo-router";

type FormData = {
  email: string;
  name: string;
  password: string;
};

export default function RegisterScreen() {
  const { mutateAsync: register } = useRegister();
  const { login } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
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
        <ThemedText type="smallTitle">Welcome!</ThemedText>
        <InputContainer>
          <ThemedText type="label">Name</ThemedText>
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
                textContentType="name"
              />
            )}
            name="name"
          />
        </InputContainer>
        {errors.name && <ThemedText>This field is required</ThemedText>}
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
          title="Create"
          onPress={handleSubmit(onSubmit)}
          fullWidth
        />
      </BodyContainer>
    </PageContainer>
  );
}
