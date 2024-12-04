import { DimensionValue, View } from "react-native";

interface DividerProps {
  size?: DimensionValue;
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  size = 1,
  orientation = "horizontal",
}: DividerProps) {
  return (
    <View
      style={{
        width: orientation === "horizontal" ? size : 1,
        height: orientation === "vertical" ? size : 1,
        backgroundColor: "#f0f0f0",
      }}
    />
  );
}
