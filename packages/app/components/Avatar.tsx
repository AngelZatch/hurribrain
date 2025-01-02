import { Image } from "react-native";

export default function Avatar() {
  return (
    <Image
      source={{
        uri: "https://images.squarespace-cdn.com/content/v1/5c39e499697a984f8b163b5c/1689188407060-92YLPDG9ZPJ2CFWQIUIN/03+Y%27shtola.jpg",
      }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 50,
      }}
    />
  );
}
