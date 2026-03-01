import { View, type ViewProps } from "react-native";

export function PageContainer({ style, ...otherProps }: ViewProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 6,
          padding: 20,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
