import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import ThemedTextInput from "./ui/ThemedTextInput";
import { InputContainer } from "./ui/InputContainer";
import ThemedButton from "./ui/ThemedButton";
import { useAuth } from "@/contexts/auth.context";
import { useJoinGame } from "@/api/games.api";
import React from "react";

type FormData = {
  code: string;
};

export default function JoinGameForm() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      code: "",
    },
  });

  const { mutateAsync: joinGame, error } = useJoinGame(user);

  const onSubmit = async (data: FormData) => {
    // Join the game
    await joinGame(data.code);

    // If successful, navigate to the game
  };

  return (
    <>
      <InputContainer>
        <ThemedText type="label">Put your game code here:</ThemedText>
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
            />
          )}
          name="code"
        />
      </InputContainer>
      {errors.code && <ThemedText>This field is required</ThemedText>}
      {error && <ThemedText>{error.message}</ThemedText>}
      <View
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedButton title="Join" onPress={handleSubmit(onSubmit)} />
      </View>
    </>
  );
}
