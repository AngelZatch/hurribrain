import { View, type ViewProps } from "react-native";

export function InputContainer({ style, ...otherProps }: ViewProps) {
  return (
    <View
      style={[
        {
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 5,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
