import { View } from "react-native";
import { InputContainer } from "./ui/InputContainer";
import ThemedText from "./ui/ThemedText";
import { Controller, useForm } from "react-hook-form";
import ThemedTextInput from "./ui/ThemedTextInput";
import ThemedButton from "./ui/ThemedButton";
import { useDeleteAccount } from "@/api/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { router } from "expo-router";

type FormData = {
  email: string;
  password: string;
};

export default function DeleteAccountModal() {
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
  const { user, logout } = useAuth();
  const { mutateAsync: deleteAccount, error } = useDeleteAccount(user!);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      await deleteAccount(data);
      logout();
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
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
      <View>
        <ThemedButton
          title="Annuler"
          fullWidth
          type="secondary"
          onPress={() => {}}
        />
        <ThemedButton
          title="Supprimer"
          fullWidth
          type="danger"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
      </View>
    </View>
  );
}
