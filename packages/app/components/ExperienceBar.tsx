import { View } from "react-native";
import ThemedText from "./ThemedText";

interface ExperienceBarProps {
  current: number;
  level: number;
}

export default function ExperienceBar({ current, level }: ExperienceBarProps) {
  const experienceTable: Array<number> = [
    100, 120, 144, 172, 206, 247, 296, 355, 426, 511, 562, 618, 679, 746, 820,
    902, 992, 1091, 1200, 1320, 1412, 1510, 1615, 1728, 1848, 1977, 2115, 2263,
    2421, 2590, 2719, 2854, 2996, 3145, 3302, 3467, 3640, 3822, 4013, 4213,
    4381, 4556, 4738, 4927, 5124, 5328, 5541, 5762, 5992, 6231, 6417, 6609,
    6807, 7011, 7221, 7437, 7660, 7889, 8125, 8368, 8535, 8705, 8879, 9056,
    9237, 9421, 9609, 9801, 9997, 10196, 10297, 10399, 10502, 10607, 10713,
    10820, 10928, 11037, 11147, 11258, 11370, 11483, 11597, 11712, 11829, 11947,
    12066, 12186, 12307, 12430, 12554, 12679, 12805, 12933, 13062, 13192, 13323,
    13456, 13590, 13725,
  ];

  const progressionWidth = (current / experienceTable[level - 1]) * 100;

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        gap: 10,
        width: "100%",
      }}
    >
      <ThemedText
        style={{
          fontFamily: "Exo_400Regular_Italic",
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: "auto",
        }}
      >
        Lv. {level}
      </ThemedText>
      <View
        style={{
          height: 13,
          borderRadius: 5,
          width: "100%",
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: "auto",
          backgroundColor: "#FFFFFF66",
        }}
      >
        <View
          style={{
            width: `${progressionWidth}%`,
            height: "100%",
            borderRadius: 5,
            backgroundColor: "#F6C744",
          }}
        />
      </View>
    </View>
  );
}
