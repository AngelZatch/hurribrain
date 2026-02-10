import { Participation } from "@/api/play.api";
import { TouchableOpacity } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type ItemButtonProps = {
  participation: Participation;
};

export default function ItemButton({ participation }: ItemButtonProps) {
  // const [isUsingItem, setIsUsingItem] = useState(false);
  // const { mutate: useItem } = useUseItem(
  //   participation.user,
  //   participation.game,
  // );

  // const handleUseItem = async () => {
  //   if (!participation.activeItem || isUsingItem) {
  //     return;
  //   }

  //   setIsUsingItem(true);

  //   await useItem({
  //     itemId: participation.activeItem,
  //   });

  //   setIsUsingItem(false);
  // };

  return (
    <AnimatedCircularProgress
      size={70}
      width={6}
      fill={participation.itemCharge}
      rotation={0}
      tintColor={"#FFD700"}
      backgroundColor="#2F2F2F"
    >
      {(fill) => (
        <TouchableOpacity
          // onPress={handleUseItem}
          // disabled={!participation.activeItem || isUsingItem}
          disabled={!participation.activeItem}
          style={{
            width: 70,
            height: 70,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
    </AnimatedCircularProgress>
  );
}
