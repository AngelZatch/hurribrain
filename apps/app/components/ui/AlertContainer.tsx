import { View } from "react-native";
import ThemedText from "./ThemedText";

type AlertContainerProps = {
  type: "info" | "warning" | "error";
  text: string;
};

export default function AlertContainer({ type, text }: AlertContainerProps) {
  return (
    <View
      style={{
        backgroundColor: "#d36f6f66",
        borderColor: "#d36f6f",
        borderWidth: 2,
        borderStyle: "solid",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
      }}
    >
      <ThemedText style={{ fontFamily: "Exo_700Bold" }}>{text}</ThemedText>
    </View>
  );
}
