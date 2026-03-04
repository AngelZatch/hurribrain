import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
} from "react-native";
import ThemedText from "./ui/ThemedText";
import { MedalName } from "@/api/play.api";

type ScoreMedalProps = {
  medal: MedalName;
};

export default function ScoreMedal({ medal }: ScoreMedalProps) {
  const textShadowStyle: {
    [key: string]: string;
  } = {
    base: "#2AD89A",
    bonus: "#FF7B1B",
    penalty: "#F1425F",
    shield: "#7b6ff9",
  };

  const MEDAL_PROFILES: Array<{
    name: MedalName;
    type: "base" | "bonus" | "penalty" | "shield";
    typeLabel: string;
    label: string;
    imagePath: ImageSourcePropType;
    bonusPoints?: string;
    bonusCharge?: string;
  }> = [
    {
      type: "base",
      name: "correct",
      typeLabel: "Récompense de base",
      label: "Bonne réponse",
      imagePath: require("@/assets/images/medals/base_correct.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "difficulty:medium",
      typeLabel: "Bonus de difficulté",
      label: "Question difficile !",
      imagePath: require("@/assets/images/medals/bonus_difficulty.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "difficulty:hard",
      typeLabel: "Bonus de difficulté",
      label: "Question très difficile !!",
      imagePath: require("@/assets/images/medals/bonus_difficulty.png"),
      bonusPoints: "+2",
    },
    {
      type: "bonus",
      name: "difficulty:hard",
      typeLabel: "Bonus de difficulté",
      label: "Question experte !!!",
      imagePath: require("@/assets/images/medals/bonus_difficulty.png"),
      bonusPoints: "+3",
    },
    {
      type: "bonus",
      name: "streak:5",
      typeLabel: "Bonus de chaîne",
      label: "5 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "streak:10",
      typeLabel: "Bonus de chaîne",
      label: "10 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+2",
    },
    {
      type: "bonus",
      name: "streak:15",
      typeLabel: "Bonus de chaîne",
      label: "15 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+3",
    },
    {
      type: "bonus",
      name: "streak:20",
      typeLabel: "Bonus de chaîne",
      label: "20 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+4",
    },
    {
      type: "bonus",
      name: "streak:25",
      typeLabel: "Bonus de chaîne",
      label: "25 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+5",
    },
    {
      type: "bonus",
      name: "streak:30",
      typeLabel: "Bonus de chaîne",
      label: "30 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+6",
    },
    {
      type: "bonus",
      name: "streak:35",
      typeLabel: "Bonus de chaîne",
      label: "35 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+7",
    },
    {
      type: "bonus",
      name: "streak:40",
      typeLabel: "Bonus de chaîne",
      label: "40 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+8",
    },
    {
      type: "bonus",
      name: "streak:45",
      typeLabel: "Bonus de chaîne",
      label: "45 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+9",
    },
    {
      type: "bonus",
      name: "streak:50",
      typeLabel: "Bonus de chaîne",
      label: "50 à la suite !",
      imagePath: require("@/assets/images/medals/bonus_chain.png"),
      bonusPoints: "+10",
    },
    {
      type: "bonus",
      name: "speed:fastest",
      typeLabel: "Bonus de rapidité",
      label: "Réponse la plus rapide !!!",
      imagePath: require("@/assets/images/medals/bonus_speed.png"),
      bonusPoints: "+3",
    },
    {
      type: "bonus",
      name: "speed:faster",
      typeLabel: "Bonus de rapidité",
      label: "Réponse très rapide !!",
      imagePath: require("@/assets/images/medals/bonus_speed.png"),
      bonusPoints: "+2",
    },
    {
      type: "bonus",
      name: "speed:fast",
      typeLabel: "Bonus de rapidité",
      label: "Réponse rapide !",
      imagePath: require("@/assets/images/medals/bonus_speed.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "boost",
      typeLabel: "Bonus de Boost",
      label: "Boost !!",
      imagePath: require("@/assets/images/medals/base_correct.png"),
      bonusPoints: "x2",
      bonusCharge: "+20",
    },
    {
      type: "bonus",
      name: "gold:boost",
      typeLabel: "Bonus de Tour",
      label: "Tour doré !!",
      imagePath: require("@/assets/images/medals/base_correct.png"),
      bonusPoints: "x2",
      bonusCharge: "+20",
    },
    {
      type: "shield",
      name: "gold:shield",
      typeLabel: "Protection contre les pénalités",
      label: "Tour doré",
      imagePath: require("@/assets/images/medals/base_correct.png"),
    },
    {
      type: "base",
      name: "incorrect",
      typeLabel: "Pénalité",
      label: "Mauvaise réponse",
      imagePath: require("@/assets/images/medals/base_wrong.png"),
      bonusPoints: "-1",
    },
    {
      type: "penalty",
      name: "judge",
      typeLabel: "Pénalité",
      label: "Pénalité du Juge",
      imagePath: require("@/assets/images/medals/base_wrong.png"),
      bonusPoints: "-2",
    },
  ];

  const currentMedalProfile = MEDAL_PROFILES.find(
    (profile) => profile.name === medal,
  );

  if (!currentMedalProfile) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
      <Image
        source={currentMedalProfile.imagePath}
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
          <ThemedText
            style={{
              textShadowColor: textShadowStyle[currentMedalProfile.type],
              ...styles.typeLabel,
            }}
          >
            {currentMedalProfile.typeLabel}
          </ThemedText>
          <ThemedText
            style={{
              textShadowColor: textShadowStyle[currentMedalProfile.type],
              ...styles.bonusLabel,
            }}
          >
            {currentMedalProfile.label}
          </ThemedText>
        </View>
        {currentMedalProfile.bonusPoints && (
          <View
            style={{ flexDirection: "row", gap: 5, alignItems: "baseline" }}
          >
            <ThemedText
              style={{
                textShadowColor: textShadowStyle[currentMedalProfile.type],
                ...styles.bonusLabel,
              }}
            >
              {currentMedalProfile.bonusPoints}
            </ThemedText>
            <ThemedText
              style={{
                textShadowColor: textShadowStyle[currentMedalProfile.type],
                ...styles.typeLabel,
                fontStyle: "normal",
              }}
            >
              pts
            </ThemedText>
          </View>
        )}
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
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 7,
    color: "#ffffff",
  },
  bonusLabel: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "Exo_700Bold",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 7,
    color: "#ffffff",
  },
});
