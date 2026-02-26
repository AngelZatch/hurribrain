import { useColorScheme, View } from "react-native";
import ThemedText from "./ui/ThemedText";
import ThemedButton from "./ui/ThemedButton";
import { Colors } from "@/constants/Colors";

type RecoverAccountModalProps = {
  onRequestCancel: () => void;
  onRequestProceed: () => void;
};

export default function RecoverAccountModal({
  onRequestCancel,
  onRequestProceed,
}: RecoverAccountModalProps) {
  const backgroundColor = useColorScheme() ?? "light";

  return (
    <View
      style={{
        gap: 20,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "0%",
        justifyContent: "center",
        height: 200,
        padding: 12,
        backgroundColor: "#00000050",
      }}
    >
      <View
        style={{
          backgroundImage: Colors[backgroundColor].backgroundGradient,
          padding: 20,
          gap: 20,
          height: "auto",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "stretch",
          justifyContent: "center",
          borderRadius: 20,
          boxShadow: "0px 5px 15px #00000066",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText type="modalHead">Compte en Suppression</ThemedText>
          <ThemedButton
            type="secondary"
            icon="xmark"
            title=""
            onPress={onRequestCancel}
          />
        </View>
        <View style={{ gap: 20 }}>
          <ThemedText type="default">
            Ton compte est marqué pour suppression. Si tu n'es pas à l'origine
            de cette demande et/ou que tu souhaites l'annuler, tu peux récupérer
            ton compte.
          </ThemedText>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          <ThemedButton
            title="Retour"
            fullWidth
            type="secondary"
            onPress={onRequestCancel}
          />
          <ThemedButton
            title="Récupérer"
            fullWidth
            type="primary"
            onPress={onRequestProceed}
          />
        </View>
      </View>
    </View>
  );
}
