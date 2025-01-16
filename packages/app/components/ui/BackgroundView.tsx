import { ImageBackground, View, type ViewProps } from "react-native";

import backgroundPicture from "@/assets/images/background_waves.png";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export function BackgroundView({ style, ...otherProps }: ViewProps) {
  const backgroundColor = useColorScheme() ?? "light";

  return (
    <ImageBackground
      source={backgroundPicture}
      resizeMode="cover"
      style={[
        {
          backgroundImage: Colors[backgroundColor].backgroundGradient,
          width: "100%",
          height: "100%",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
