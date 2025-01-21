import { useCreateGame, useJoinGame } from "@/api/games.api";
import { useAuth } from "@/contexts/auth.context";
import { Controller, useForm } from "react-hook-form";
import { InputContainer } from "./ui/InputContainer";
import React, { useState } from "react";
import ThemedText from "./ui/ThemedText";
import { Divider } from "./ui/Divider";
import { View } from "react-native";
import ThemedButton from "./ui/ThemedButton";
import { ContainerView } from "./ui/ContainerView";
import Slider from "@react-native-community/slider";
import ThemedIconButton from "./ui/ThemedIconButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Tag, useGetTags } from "@/api/tags.api";
import DifficultyChip from "./DifficultyChip";
import MultiSelect from "./MultiSelect";

type FormData = {
  tags: Array<Tag>;
  length: number;
  difficulty: number;
};

type DifficultyMap = {
  [key: number]: {
    text: "easy" | "medium" | "hard" | "expert";
    color: string;
  };
};

export default function CreateGameForm() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  if (!user) {
    return null;
  }

  const { data, isLoading } = useGetTags();

  const difficultyMap: DifficultyMap = {
    25: {
      text: "easy",
      color: "#3DC96C",
    },
    50: {
      text: "medium",
      color: "#D1A256",
    },
    75: {
      text: "hard",
      color: "#E0521E",
    },
    100: {
      text: "expert",
      color: "#990000",
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      tags: [],
      length: 20,
      difficulty: 25,
    },
  });

  const { mutateAsync: createGame, error } = useCreateGame(user);
  const { mutateAsync: joinGame } = useJoinGame(user);

  const onSubmit = async (data: FormData) => {
    // Create the game and join it
    const createdGame = await createGame({
      tags: data.tags,
      length: data.length,
      difficulty: difficultyMap[data.difficulty].text,
      isPrivate: true,
    });

    console.log(createdGame);

    // If successful, join the game and navigate to it
    await joinGame(createdGame.code);

    // If successful, navigate to the game
  };

  return (
    <>
      <ContainerView
        style={{
          flexGrow: 1,
          flexDirection: "column",
          gap: 16,
        }}
      >
        <InputContainer>
          <ThemedText type="label">Choisis tes thèmes</ThemedText>
          <ThemedText type="helper">
            Les questions seront choisies au hasard parmi les thèmes
            sélectionnés (jusqu’à 3 thèmes max.)
          </ThemedText>
          {isLoading && <ThemedText>Loading...</ThemedText>}
          <Controller
            control={control}
            rules={{ required: true }}
            name="tags"
            render={({ field: { onChange, onBlur, value } }) => (
              <MultiSelect
                items={data ?? []}
                selectedItems={value}
                onPress={onChange}
              />
            )}
          />
        </InputContainer>
        <InputContainer>
          <ThemedText type="label">Choisis la difficulté</ThemedText>
          <ThemedText type="helper">
            Règle le degré de challenge de ta partie en choisissant la
            difficulté des questions que tu veux avoir.
          </ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <ThemedIconButton
                  disabled={value <= 25}
                  icon="minus"
                  onPress={() => onChange(Math.max(value - 25, 25))}
                />
                <Slider
                  value={value}
                  onValueChange={onChange}
                  onSlidingComplete={onBlur}
                  minimumValue={25}
                  maximumValue={100}
                  lowerLimit={25}
                  upperLimit={100}
                  step={25}
                  minimumTrackTintColor={difficultyMap[value].color}
                  thumbTintColor={difficultyMap[value].color}
                  maximumTrackTintColor="#C7C7C7"
                  style={{
                    flexShrink: 1,
                    flexGrow: 1,
                  }}
                />
                <ThemedIconButton
                  disabled={value >= 100}
                  icon="plus"
                  onPress={() => onChange(Math.min(value + 25, 100))}
                />
              </View>
            )}
            name="difficulty"
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <DifficultyChip
              difficulty={difficultyMap[watch("difficulty")].text}
              fullSize
            />
          </View>
        </InputContainer>
        <Divider orientation="horizontal" />
        <InputContainer>
          <ThemedText type="label">Ajuste la durée de la partie</ThemedText>
          <ThemedText type="helper">
            Un tour se déroule en environ 30 secondes.
          </ThemedText>
        </InputContainer>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <ThemedIconButton
                disabled={value <= 10}
                icon="minus"
                onPress={() => onChange(Math.max(value - 5, 10))}
              />
              <Slider
                value={value}
                onValueChange={onChange}
                onSlidingComplete={onBlur}
                minimumValue={10}
                maximumValue={50}
                lowerLimit={10}
                upperLimit={50}
                step={5}
                minimumTrackTintColor="#0A99FF"
                thumbTintColor="#0A99FF"
                maximumTrackTintColor="#C7C7C7"
                style={{
                  flexShrink: 1,
                  flexGrow: 1,
                }}
              />
              <ThemedIconButton
                disabled={value >= 50}
                icon="plus"
                onPress={() => onChange(Math.min(value + 5, 50))}
              />
            </View>
          )}
          name="length"
        />
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 12,
            color: Colors[colorScheme ?? "light"].disabled,
            fontStyle: "italic",
          }}
        >
          {watch("length")} tours (environ {Math.round(watch("length") * 0.5)}{" "}
          minutes).
        </ThemedText>
      </ContainerView>
      <View
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedButton
          title="Créer une partie"
          onPress={handleSubmit(onSubmit)}
          fullWidth
        />
      </View>
    </>
  );
}
