import { Modal, ModalProps, View } from "react-native";
import { InputContainer } from "./ui/InputContainer";
import ThemedText from "./ui/ThemedText";
import { Controller, useForm } from "react-hook-form";
import ThemedTextInput from "./ui/ThemedTextInput";
import ThemedButton from "./ui/ThemedButton";
import { useDeleteAccount } from "@/api/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { router } from "expo-router";
import { PageContainer } from "@/components/ui/PageContainer";

type FormData = {
  email: string;
  password: string;
};

type DeleteAccountModal = {
  onRequestClose: () => void;
};

export default function DeleteAccountModal({
  onRequestClose,
}: DeleteAccountModal) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { user, logout } = useAuth();
  const { mutateAsync: deleteAccount, error } = useDeleteAccount(user!);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      await deleteAccount(data);
      logout();
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

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
          backgroundColor: "#FFF",
          padding: 20,
          gap: 20,
          flexDirection: "column",
          alignContent: "center",
          alignItems: "stretch",
          justifyContent: "center",
          borderRadius: 20,
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
          <ThemedText type="modalHead">Suppression du Compte</ThemedText>
          <ThemedButton
            type="secondary"
            icon="xmark"
            title=""
            onPress={onRequestClose}
          />
        </View>
        <View style={{ gap: 20 }}>
          <ThemedText type="default">
            Désactive immédiatement ton compte. Tu dispoes de 24 heures pour
            annuler la procédure, après quoi ton compte sera définitivement
            supprimé. Aucune sauvegarde n'est conservée par HurriBrain.
          </ThemedText>
          <InputContainer>
            <ThemedText type="label">Adresse mail</ThemedText>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  placeholder="Type here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  inputMode="email"
                  textContentType="emailAddress"
                />
              )}
              name="email"
            />
          </InputContainer>
          {errors.email && <ThemedText>This field is required</ThemedText>}
          <InputContainer>
            <ThemedText type="label">Password</ThemedText>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  placeholder="Type here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  inputMode="text"
                  secureTextEntry
                  textContentType="password"
                />
              )}
              name="password"
            />
          </InputContainer>
          {errors.password && <ThemedText>This field is required</ThemedText>}
          <View
            style={{
              flexDirection: "row",
              gap: 16,
            }}
          >
            <ThemedButton
              title="Annuler"
              fullWidth
              type="secondary"
              onPress={onRequestClose}
            />
            <ThemedButton
              title="Supprimer"
              fullWidth
              type="danger"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
