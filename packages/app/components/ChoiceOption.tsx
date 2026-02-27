import { Pressable, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Choice } from "@/api/play.api";

type ChoiceOptionProps = {
  choice: Choice;
  isSelected: boolean;
  isSent: boolean;
  onPress: () => void;
};

export default function ChoiceOption({
  choice,
  isSelected,
  isSent,
  onPress,
}: ChoiceOptionProps) {
  return (
    <Pressable key={choice.uuid} onPress={onPress}>
      <View
        style={[
          {
            paddingHorizontal: 0,
            paddingVertical: 12,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderRadius: 16,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#94CED080",
            backgroundColor: "transparent",
            minHeight: 50,
          },
          isSelected && { backgroundColor: "#94CED080" },
          isSent && { backgroundColor: "#0A99FF" },
        ]}
      >
        <ThemedText
          style={[
            {
              fontFamily: "Exo_600SemiBold",
              fontSize: 16,
            },
            isSent && { color: "white" },
          ]}
        >
          {choice.value}
        </ThemedText>
      </View>
    </Pressable>
  );
}
