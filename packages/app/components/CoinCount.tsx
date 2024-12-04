import { Text, View } from "react-native";

interface CoinCountProps {
  count: number;
}

export default function CoinCount({ count }: CoinCountProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Exo_400Regular",
        }}
      >
        {count}
      </Text>
    </View>
  );
}
