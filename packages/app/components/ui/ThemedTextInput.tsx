import { Colors } from "@/constants/Colors";
import { TextInput, TextInputProps, useColorScheme } from "react-native";

type ThemedTextInputProps = TextInputProps & {
  type?: "primary" | "secondary";
};

export default function ThemedTextInput({
  type,
  ...otherProps
}: ThemedTextInputProps) {
  const colorScheme = useColorScheme();

  return (
    <TextInput
      style={{
        height: 42,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Colors[colorScheme ?? "light"].main,
        backgroundColor: "#D9D9D966",
        alignSelf: "stretch",
        fontSize: 16,
        fontFamily: "Exo_600SemiBold",
      }}
      placeholderTextColor="#ABABAB"
      {...otherProps}
    />
  );
}
