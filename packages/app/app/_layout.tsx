import React from "react";
import { Slot } from "expo-router";

import { AuthProvider } from "@/contexts/auth.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MyDarkTheme, MyLightTheme } from "@/constants/Colors";
import {
  useFonts,
  Exo_100Thin,
  Exo_200ExtraLight,
  Exo_300Light,
  Exo_400Regular,
  Exo_500Medium,
  Exo_600SemiBold,
  Exo_700Bold,
  Exo_800ExtraBold,
  Exo_900Black,
  Exo_100Thin_Italic,
  Exo_200ExtraLight_Italic,
  Exo_300Light_Italic,
  Exo_400Regular_Italic,
  Exo_500Medium_Italic,
  Exo_600SemiBold_Italic,
  Exo_700Bold_Italic,
  Exo_800ExtraBold_Italic,
  Exo_900Black_Italic,
} from "@expo-google-fonts/exo";
import { BackgroundView } from "@/components/ui/BackgroundView";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Exo_100Thin,
    Exo_200ExtraLight,
    Exo_300Light,
    Exo_400Regular,
    Exo_500Medium,
    Exo_600SemiBold,
    Exo_700Bold,
    Exo_800ExtraBold,
    Exo_900Black,
    Exo_100Thin_Italic,
    Exo_200ExtraLight_Italic,
    Exo_300Light_Italic,
    Exo_400Regular_Italic,
    Exo_500Medium_Italic,
    Exo_600SemiBold_Italic,
    Exo_700Bold_Italic,
    Exo_800ExtraBold_Italic,
    Exo_900Black_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
      >
        <QueryClientProvider client={queryClient}>
          <BackgroundView>
            <Slot initialRouteName="welcome" />
          </BackgroundView>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
