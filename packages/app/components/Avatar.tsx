import { Image } from "react-native";

export default function Avatar() {
  return (
    <Image
      source={{
        uri: "https://img3.gelbooru.com/images/b0/2b/b02b35d59f9e6611ba6d5e19958690f0.jpg",
      }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 50,
      }}
    />
  );
}
