import { Pressable, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Choice } from "@/api/play.api";

type ChoiceOptionProps = {
  choice: Choice;
  isSent: boolean;
  onPress: () => void;
};

export default function ChoiceOption({
  choice,
  isSent,
  onPress,
}: ChoiceOptionProps) {
  return (
    <Pressable
      key={choice.uuid}
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 4,
          paddingVertical: 4,
          alignItems: "center",
          justifyContent: "center",
          width: "48%",
          borderRadius: 16,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#94CED080",
          backgroundColor: "#00000033",
          minHeight: 80,
          maxHeight: 80,
        },
        isSent && { backgroundColor: "#0A99FF" },
      ]}
    >
      <ThemedText
        style={[
          {
            fontFamily: "Exo_600SemiBold",
            fontSize: choice.value.length > 30 ? 14 : 16,
            textAlign: "center",
          },
          isSent && { color: "white" },
        ]}
      >
        {choice.value}
      </ThemedText>
    </Pressable>
  );
}
