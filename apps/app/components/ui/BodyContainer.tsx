import { View, type ViewProps } from "react-native";

export function BodyContainer({ style, ...otherProps }: ViewProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          width: "100%",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
