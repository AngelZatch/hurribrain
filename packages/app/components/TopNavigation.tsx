import { useRouter } from "expo-router";
import { Button, View } from "react-native";

type TopNavigationProps = {
  topLabel?: string;
  subLabel?: string;
};

export default function TopNavigation() {
  const router = useRouter();

  return (
    <View
      style={{
        display: "flex",
        height: 77,
        paddingHorizontal: 10,
        paddingVertical: 0,
        alignItems: "center",
        gap: 10,
        alignSelf: "stretch",
      }}
    >
      <Button
        title="BACK"
        onPress={() => {
          router.back();
        }}
      />
    </View>
  );
}
