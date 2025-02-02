import { useRouter } from "expo-router";
import { View } from "react-native";
import ThemedIconButton from "./ui/ThemedIconButton";
import ThemedText from "./ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type TopNavigationProps = {
  topLabel?: string;
  subLabel?: string;
  onPress?: () => void;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export default function TopNavigation({
  topLabel,
  subLabel,
  onPress,
  leftElement,
  rightElement,
}: TopNavigationProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        height: 73,
        paddingHorizontal: 10,
        paddingVertical: 0,
        alignItems: "center",
        gap: 10,
        alignSelf: "stretch",
      }}
    >
      {leftElement ?? (
        <ThemedIconButton
          icon={"chevron.left"}
          onPress={() => {
            onPress ?? router.back();
          }}
        />
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
        }}
      >
        {topLabel && (
          <ThemedText
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: "Exo_600SemiBold",
              color: Colors[colorScheme ?? "light"].disabled,
            }}
          >
            {topLabel}
          </ThemedText>
        )}
        {subLabel && (
          <ThemedText
            style={{
              fontSize: 16,
              lineHeight: 21,
              fontFamily: "Exo_600SemiBold",
              color: Colors[colorScheme ?? "light"].text,
              letterSpacing: 0.8,
            }}
          >
            {subLabel}
          </ThemedText>
        )}
      </View>
      <View style={{ minWidth: 40 }}>{rightElement}</View>
    </View>
  );
}
