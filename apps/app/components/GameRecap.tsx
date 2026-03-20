import { View } from "react-native";
import ThemedText from "./ui/ThemedText";
import { Link, useRouter } from "expo-router";
import ThemedButton from "./ui/ThemedButton";
import { MyAccountInfo } from "@/api/auth.api";

export default function GameRecap({ me }: { me: MyAccountInfo }) {
  const router = useRouter();

  const navigateToHome = () => {
    router.replace("/games");
    router.replace("/");
  };

  const authToConvert = () => {
    router.push({
      pathname: "/convert",
    });
  };

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <ThemedText
        style={{
          fontSize: 32,
          fontFamily: "Exo_600SemiBold",
          paddingVertical: 25,
          textAlign: "center",
        }}
      >
        La partie est terminée !
      </ThemedText>
      <View
        style={{
          gap: 8,
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {me.role === "lite" && (
          <View
            style={{
              gap: 4,
              flexDirection: "column",
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "100%",
            }}
          >
            <ThemedText
              style={{
                textAlign: "center",
                fontFamily: "Exo_800ExtraBold",
              }}
              glow
            >
              Crée un compte et garde ta progression !
            </ThemedText>
            <Link push href="/convert" asChild>
              <ThemedButton
                title="Créer un compte"
                onPress={() => {}}
                type="secondary"
              />
            </Link>
          </View>
        )}
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "100%",
          }}
        >
          <ThemedButton
            title={me.role === "lite" ? "Quitter" : "Retourner à l'accueil"}
            onPress={navigateToHome}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}
