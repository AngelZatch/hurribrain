import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export function ContainerView({ style, ...otherProps }: ViewProps) {
  const backgroundColor = useThemeColor({}, "containerBackground");

  return (
    <View
      style={[
        {
          backgroundColor,
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: "auto",
          width: "100%",
          flexDirection: "row",
          gap: 10,
          padding: 16,
          borderRadius: 20,
          outlineColor: "#8a8888",
          outlineWidth: 2,
          outlineOffset: -2,
          outlineStyle: "solid",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
