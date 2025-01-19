import { Choice } from "@/api/games.api";
import { Pressable, View } from "react-native";
import ThemedText from "./ui/ThemedText";

type ChoiceOptionProps = {
  choice: Choice;
  isSelected: boolean;
  onPress: () => void;
};

export default function ChoiceOption({
  choice,
  isSelected,
  onPress,
}: ChoiceOptionProps) {
  return (
    <Pressable key={choice.uuid} onPress={onPress}>
      <View
        style={{
          paddingHorizontal: 0,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          borderRadius: 16,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#94CED080",
          backgroundColor: isSelected ? "#94CED080" : "transparent",
        }}
      >
        <ThemedText
          style={{
            fontFamily: "Exo_600SemiBold",
            fontSize: 16,
          }}
        >
          {choice.value}
        </ThemedText>
      </View>
    </Pressable>
  );
}
