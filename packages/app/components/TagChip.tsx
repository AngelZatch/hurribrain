import { Text, View } from "react-native";
import ThemedText from "./ui/ThemedText";

type TagChipProps = {
  text: string;
};

export default function TagChip({ text }: TagChipProps) {
  return (
    <View
      style={{
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        minHeight: 24,
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 13,
        backgroundColor: "#0A99FF",
      }}
    >
      <View
        style={{
          paddingHorizontal: 4,
          paddingVertical: 0,
        }}
      >
        <ThemedText
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: "Exo_400Regular",
            textTransform: "capitalize",
            color: "#FFFFFF",
          }}
        >
          {text}
        </ThemedText>
      </View>
    </View>
  );
}
