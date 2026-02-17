import { Image } from "react-native";

export default function Avatar() {
  return (
    <Image
      source={{
        uri: "https://static.wikia.nocookie.net/finalfantasy/images/5/58/Theatrhythm_CC_Y%E2%80%99shtola.png",
      }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 50,
      }}
    />
  );
}
