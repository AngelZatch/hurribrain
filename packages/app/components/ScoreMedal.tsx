import { View, StyleSheet, Image } from "react-native";
import ThemedText from "./ui/ThemedText";
import { useEffect, useState } from "react";
type BaseMedal = "wrong" | "correct";
type DifficultyMedal = "medium" | "hard" | "expert";

const BaseCorrectMedal = require("@/assets/images/medals/base_correct.png");

type MedalType =
  | {
      type: "base";
      value: BaseMedal;
    }
  | {
      type: "difficulty";
      value: DifficultyMedal;
    }
  | {
      type: "speed";
      value: number;
    }
  | {
      type: "chain";
      value: number;
    };

type ScoreMedalProps = {
  medalType: MedalType;
};

export default function ScoreMedal({ medalType }: ScoreMedalProps) {
  const medalLabel = (medalType: MedalType) => {
    if (medalType.type === "base") {
      return medalType.value === "correct"
        ? "Bonne réponse"
        : "Mauvaise réponse";
    }

    if (medalType.type === "speed") {
      switch (medalType.value) {
        case 1:
          return "Réponse la plus rapide !!!";
        case 2:
          return "Réponse très rapide !!";
        case 3:
          return "Réponse rapide !";
        default:
          return null;
      }
    }

    if (medalType.type === "chain") {
      switch (medalType.value) {
        case 5:
          return "Cinq à la suite !";
        case 10:
          return "Dix à la suite !!";
        case 15:
          return "Quinze à la suite !!!";
        default:
          return null;
      }
    }

    if (medalType.type === "difficulty") {
      switch (medalType.value) {
        case "medium":
          return "Question difficile !";
        case "hard":
          return "Question très difficile !!";
        case "expert":
          return "Question experte !!!";
        default:
          return null;
      }
    }
  };

  const medalTypeLabel = (medalType: MedalType) => {
    switch (medalType.type) {
      case "base":
        return medalType.value === "correct"
          ? "Récompense de base"
          : "Pénalité";
      case "speed":
        return `Bonus de rapidité`;
      case "chain":
        return `Bonus de chaîne`;
      case "difficulty":
        return `Bonus de difficulté`;
      default:
        return null;
    }
  };

  const shadowStyle = {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textShadowColor:
      medalType.value === "correct"
        ? "#2AD89A"
        : medalType.value === "wrong"
          ? "#F1425F"
          : "#FF7B1B",
  };

  const MEDAL_PROFILES = [
    {
      type: "base",
      value: "correct",
      typeLabel: "Récompense de base",
      label: "Bonne réponse",
      imagePath: require("@/assets/images/medals/base_correct.png"),
      points: "+1",
    },
    {
      type: "base",
      value: "wrong",
      typeLabel: "Pénalité",
      label: "Mauvaise réponse",
      imagePath: require("@/assets/images/medals/base_wrong.png"),
      points: "-1",
    },
    {
      type: "difficulty",
      value: "medium",
      typeLabel: "Bonus de difficulté",
      label: "Question difficile !",
      imagePath: require("@/assets/images/medals/bonus_difficulty.png"),
      points: "+1",
    },
    {
      type: "difficulty",
      value: "hard",
      typeLabel: "Bonus de difficulté",
      label: "Question très difficile !!",
      imagePath: require("@/assets/images/medals/bonus_difficulty.png"),
      points: "+2",
    },
    {
      type: "difficulty",
      value: "expert",
      typeLabel: "Bonus de difficulté",
      label: "Question experte !!!",
      imagePath: require("@/assets/images/medals/bonus_difficulty.png"),
      points: "+3",
    },
    {
      type: "speed",
      value: 1,
      typeLabel: "Bonus de rapidité",
      label: "Réponse la plus rapide !!!",
      imagePath: require("@/assets/images/medals/bonus_speed.png"),
      points: "+3",
    },
    {
      type: "speed",
      value: 2,
      typeLabel: "Bonus de rapidité",
      label: "Réponse très rapide !!",
      imagePath: require("@/assets/images/medals/bonus_speed.png"),
      points: "+2",
    },
    {
      type: "speed",
      value: 3,
      typeLabel: "Bonus de rapidité",
      label: "Réponse rapide !",
      imagePath: require("@/assets/images/medals/bonus_speed.png"),
      points: "+1",
    },
    {
      type: "chain",
      value: 5,
      typeLabel: "Bonus de chaîne",
      label: "Cinq à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      points: "+1",
    },
    {
      type: "chain",
      value: 10,
      typeLabel: "Bonus de chaîne",
      label: "Dix à la suite !!",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      points: "+2",
    },
    {
      type: "chain",
      value: 15,
      typeLabel: "Bonus de chaîne",
      label: "Quinze à la suite !!!",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      points: "+3",
    },
  ];

  const currentMedalProfile = MEDAL_PROFILES.find(
    (profile) =>
      profile.type === medalType.type && profile.value === medalType.value
  );

  return (
    <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
      <Image
        source={currentMedalProfile?.imagePath}
        style={{ height: 40, width: 40 }}
      />
      <View
        style={{
          alignItems: "center",
          gap: 10,
          flexGrow: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            flexGrow: 1,
          }}
        >
          <ThemedText style={[styles.typeLabel, shadowStyle]}>
            {currentMedalProfile?.typeLabel}
          </ThemedText>
          <ThemedText style={[styles.bonusLabel, shadowStyle]}>
            {currentMedalProfile?.label}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <ThemedText style={[styles.bonusLabel, shadowStyle]}>
            {currentMedalProfile?.points}
          </ThemedText>
          <ThemedText style={shadowStyle}>pt</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  typeLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: "italic",
    fontFamily: "Exo_400Regular",
  },
  bonusLabel: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "Exo_700Bold",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
