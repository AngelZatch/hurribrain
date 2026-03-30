import { ItemName, Participation } from "@/api/play.api";
import { socket } from "@/contexts/socket";
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useEffect, useState } from "react";
import { hasStatus } from "@/utils/gameUtils";

type ItemButtonProps = {
  participation: Participation;
};

export default function ItemButton({ participation }: ItemButtonProps) {
  const [heldItem, setHeldItem] = useState(participation.activeItem);

  const getCorrectImage = (
    name: ItemName,
  ): { name: string; description: string; path: ImageSourcePropType } => {
    switch (name) {
      case "Boost":
        return {
          name: "Boost",
          description: "Double les points gagnés en cas de bonne réponse",
          path: require("@/assets/images/items/item-Boost.png"),
        };
      case "Darkness":
        return {
          name: "Gribouille",
          description: "Dessine sur l'écran d'un joueur",
          path: require("@/assets/images/items/item-Darkness.png"),
        };
      case "Super Darkness":
        return {
          name: "Super Gribouille",
          description: "Dessine sur l'écran de tout le monde",
          path: require("@/assets/images/items/item-SuperDarkness.png"),
        };
      case "Half":
        return {
          name: "50/50",
          description: "Enlève deux choix incorrects",
          path: require("@/assets/images/items/item-Half.png"),
        };
      case "Hidden":
        return {
          name: "Caché",
          description: "Vous rend invisible aux attaques",
          path: require("@/assets/images/items/item-Hidden.png"),
        };
      case "Hurry":
        return {
          name: "Chrono",
          description: "Réduit le temps de réponse d'un joueur",
          path: require("@/assets/images/items/item-Hurry.png"),
        };
      case "Judge":
        return {
          name: "Juge",
          description: "Pénalise un joueur en cas de mauvaise réponse",
          path: require("@/assets/images/items/item-Judge.png"),
        };
      case "Lock":
        return {
          name: "Verrou",
          description: "Empêche un joueur d'utiliser son objet",
          path: require("@/assets/images/items/item-Lock.png"),
        };
      case "Super Quake":
        return {
          name: "Séisme",
          description: "Retire tous les bonus de tout le monde",
          path: require("@/assets/images/items/item-Quake.png"),
        };
      case "Scramble":
        return {
          name: "Mélange",
          description: "Rend la question plus difficile à lire pour un joueur",
          path: require("@/assets/images/items/item-Scramble.png"),
        };
      case "Super Scramble":
        return {
          name: "Super Mélange",
          description:
            "Rend la question plus difficile à lire pour tout le monde",
          path: require("@/assets/images/items/item-SuperScramble.png"),
        };
      case "Shield":
        return {
          name: "Bouclier",
          description: "Annule vos malus et vous protège",
          path: require("@/assets/images/items/item-Shield.png"),
        };
      case "Turnaround":
        return {
          name: "Renversement",
          description: "Convertit vos malus en points",
          path: require("@/assets/images/items/item-Turnaround.png"),
        };
      case "Coin":
      default:
        return {
          name: "Pièce",
          description: "Gagnez 1 point immédiatement",
          path: require("@/assets/images/items/item-Coin.png"),
        };
    }
  };

  const handleUseItem = () => {
    if (hasLock) {
      return;
    }

    socket.emit("item:use", {
      game: participation.game,
      user: participation.user,
    });
    setHeldItem(null);
  };

  useEffect(() => {
    setHeldItem(participation.activeItem || null);
  }, [participation.activeItem]);

  const [hasLock, setHasLock] = useState(false);

  useEffect(() => {
    setHasLock(hasStatus(participation, "lock"));
  }, [participation]);

  return (
    <View
      style={{
        alignItems: "center",
        gap: 8,
        justifyContent: "flex-end",
        height: 120,
      }}
    >
      <View
        style={{
          borderRadius: 8,
          backgroundColor: participation.activeItem ? "#0061ff" : "#e3e3e3",
          padding: 4,
          width: 120,
        }}
      >
        {participation.activeItem ? (
          <>
            <Text
              style={{
                color: "#ffffff",
                fontFamily: "Exo_700Bold",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {getCorrectImage(participation.activeItem).name}
            </Text>
            <Text
              style={{
                color: "#e3e3e3",
                fontSize: 10,
                fontFamily: "Exo_400Regular",
                textAlign: "center",
              }}
            >
              {getCorrectImage(participation.activeItem).description}
            </Text>
          </>
        ) : (
          <Text
            style={{
              color: "#5e5e5e",
              fontFamily: "Exo_400Regular",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            Pas d'objet disponible
          </Text>
        )}
      </View>
      <AnimatedCircularProgress
        size={70}
        width={6}
        fill={participation.itemCharge}
        rotation={0}
        tintColor={!participation.activeItem ? "#0061ff" : "#e99702"}
        backgroundColor={!participation.activeItem ? "#bdbdbd" : "#00d9ff"}
      >
        {() => (
          <TouchableOpacity
            onPress={handleUseItem}
            disabled={!heldItem || hasLock}
            style={[
              {
                width: 70,
                height: 70,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: heldItem
                  ? "radial-gradient(circle at 50%, #212223,#CaCaC4)"
                  : "linear-gradient(to bottom, #7b7b7b,#c6c6c6)",
                boxShadow: "0px 2px 1px 1px #00000033",
              },
            ]}
          >
            <View>
              {heldItem && (
                <Image
                  source={getCorrectImage(heldItem).path}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}
