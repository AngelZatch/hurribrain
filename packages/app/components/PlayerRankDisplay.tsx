import { View } from "react-native";
import { OutlinedText as CustomOutlinedText } from "./ui/OutlinedText";
import { useEffect, useState } from "react";

type PlayerRankDisplayProps = {
  rank: number;
};

export default function PlayerRankDisplay({ rank }: PlayerRankDisplayProps) {
  const chooseGradient = (rank: number): string => {
    if (rank === 1) {
      return "linear-gradient(to bottom, #c5e2a2,#5edaf0,#ffd255)";
    }
    if (rank === 2) {
      return "linear-gradient(to bottom, #a1b7e2,#f05ed3,#e2e2e2)";
    }
    if (rank === 3) {
      return "linear-gradient(to bottom, #a2e1e2,#f0855e,#c59208)";
    }
    return "linear-gradient(to bottom, #667651,#9bb9bf,#c59101)";
  };

  const [correctGradient, setCorrectGradient] = useState<string>();

  useEffect(() => {
    setCorrectGradient(chooseGradient(rank));
  }, [rank]);

  return (
    <View>
      <CustomOutlinedText
        width={70}
        height={40}
        fontSize={32}
        fontFamily="Exo_700Bold"
        fillColor={correctGradient}
        strokeColor="#FFF"
        strokeWidth={3}
        shadowColor="#000"
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.84}
        shadowBlur={6}
      >
        {rank}
      </CustomOutlinedText>
    </View>
  );
}
