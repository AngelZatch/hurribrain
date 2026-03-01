import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DimensionValue, View } from "react-native";

interface DividerProps {
  size?: DimensionValue;
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  size = 1,
  orientation = "horizontal",
}: DividerProps) {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <View
      style={{
        width: orientation === "horizontal" ? size : 1,
        height: orientation === "vertical" ? size : 1,
        backgroundColor: Colors[colorScheme].text,
      }}
    />
  );
}
