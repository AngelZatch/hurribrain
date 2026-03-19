import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import {
  AndroidSymbol,
  SFSymbol,
  SymbolView,
  SymbolWeight,
} from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle, View } from "react-native";

// Maps ios (SF Symbols) to Android/Web (Material Icons)
const MAPPING = {
  "house.fill": "home",
  "gamecontroller.fill": "games",
  "person.fill": "person",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron_right",
  "chevron.left": "chevron_left",
  "gearshape.fill": "settings",
  "shield.fill": "shield",
  "door.left.hand.open": "logout",
  minus: "remove",
  plus: "add",
  "arrow.forward.square": "input",
  "star.fill": "grade",
  play: "play_arrow",
  xmark: "close",
  hourglass: "hourglass_bottom",
  "square.on.square": "content_copy",
} as Partial<Record<SFSymbol, AndroidSymbol>>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: SFSymbol;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SymbolView
        name={{ ios: name, android: MAPPING[name], web: MAPPING[name] }}
        tintColor={color ?? Colors[colorScheme ?? "light"].text}
        size={size}
      />
    </View>
  );
}
