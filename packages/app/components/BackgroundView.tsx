import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import backgroundPicture from "@/assets/images/background_waves.png";

export function BackgroundView({ style, ...otherProps }: ViewProps) {
  const backgroundGradient = useThemeColor({}, "backgroundGradient");

  return (
    <View
      style={[
        {
          backgroundImage: `${{ backgroundGradient }}, url(${{ backgroundPicture }})`,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
