import { useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native";

type TopNavigationProps = {
  topLabel?: string;
  subLabel?: string;
};

export default function TopNavigation() {
  const navigator = useNavigation();
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
          navigator.goBack();
        }}
      />
    </View>
  );
}
