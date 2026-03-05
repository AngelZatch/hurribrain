import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
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
    label: string;
    imagePath: ImageSourcePropType;
    bonusPoints?: string;
    bonusCharge?: string;
  }> = [
    {
      type: "base",
      name: "correct",
      label: "Bonne réponse",
      imagePath: require("@/assets/images/medals/medal_correct.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "difficulty:medium",
      label: "Question difficile !",
      imagePath: require("@/assets/images/medals/medal_difficulty.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "difficulty:hard",
      label: "Question très difficile !!",
      imagePath: require("@/assets/images/medals/medal_difficulty.png"),
      bonusPoints: "+2",
    },
    {
      type: "bonus",
      name: "difficulty:expert",
      label: "Question experte !!!",
      imagePath: require("@/assets/images/medals/medal_difficulty.png"),
      bonusPoints: "+3",
    },
    {
      type: "bonus",
      name: "streak:5",
      label: "5 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "streak:10",
      label: "10 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+2",
    },
    {
      type: "bonus",
      name: "streak:15",
      label: "15 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+3",
    },
    {
      type: "bonus",
      name: "streak:20",
      label: "20 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+4",
    },
    {
      type: "bonus",
      name: "streak:25",
      label: "25 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+5",
    },
    {
      type: "bonus",
      name: "streak:30",
      label: "30 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+6",
    },
    {
      type: "bonus",
      name: "streak:35",
      label: "35 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+7",
    },
    {
      type: "bonus",
      name: "streak:40",
      label: "40 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+8",
    },
    {
      type: "bonus",
      name: "streak:45",
      label: "45 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+9",
    },
    {
      type: "bonus",
      name: "streak:50",
      label: "50 à la suite !",
      imagePath: require("@/assets/images/medals/medal_chain.png"),
      bonusPoints: "+10",
    },
    {
      type: "bonus",
      name: "speed:fastest",
      label: "Réponse la plus rapide !!!",
      imagePath: require("@/assets/images/medals/medal_speed.png"),
      bonusPoints: "+3",
    },
    {
      type: "bonus",
      name: "speed:faster",
      label: "Réponse très rapide !!",
      imagePath: require("@/assets/images/medals/medal_speed.png"),
      bonusPoints: "+2",
    },
    {
      type: "bonus",
      name: "speed:fast",
      label: "Réponse rapide !",
      imagePath: require("@/assets/images/medals/medal_speed.png"),
      bonusPoints: "+1",
    },
    {
      type: "bonus",
      name: "boost",
      label: "Boost !!",
      imagePath: require("@/assets/images/medals/medal_boost.png"),
      bonusPoints: "x2",
      bonusCharge: "+20",
    },
    {
      type: "bonus",
      name: "gold:boost",
      label: "Tour doré !!",
      imagePath: require("@/assets/images/medals/medal_gold.png"),
      bonusPoints: "x2",
      bonusCharge: "+20",
    },
    {
      type: "shield",
      name: "gold:shield",
      label: "Aucun malus",
      imagePath: require("@/assets/images/medals/medal_shield.png"),
    },
    {
      type: "base",
      name: "incorrect",
      label: "Mauvaise réponse",
      imagePath: require("@/assets/images/medals/medal_incorrect.png"),
      bonusPoints: "-1",
    },
    {
      type: "penalty",
      name: "judge",
      label: "Pénalité du Juge",
      imagePath: require("@/assets/images/medals/medal_judge.png"),
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
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        gap: 8,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "100%",
        justifyContent: "space-around",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={currentMedalProfile.imagePath}
        style={{ height: 50, width: 50 }}
      />
      <ThemedText
        style={{
          textShadowColor: textShadowStyle[currentMedalProfile.type],
          ...styles.bonusLabel,
          width: "100%",
        }}
      >
        {currentMedalProfile.label}
      </ThemedText>
      {currentMedalProfile.bonusPoints && (
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "baseline",
            flexGrow: 1,
          }}
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
    fontSize: 18,
    lineHeight: 21,
    fontFamily: "Exo_700Bold",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 7,
    color: "#ffffff",
  },
});
