import { ImageBackground, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import backgroundPicture from "../assets/images/background_waves.png";

export function BackgroundView({ style, ...otherProps }: ViewProps) {
  const backgroundGradient = useThemeColor({}, "backgroundGradient");

  return (
    <ImageBackground
      source={backgroundPicture}
      resizeMode="cover"
      style={[
        {
          backgroundImage: backgroundGradient,
          width: "100%",
          height: "100%",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
