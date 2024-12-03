import { View, type ViewProps } from "react-native";

export function PageContainer({ style, ...otherProps }: ViewProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          padding: 20,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
