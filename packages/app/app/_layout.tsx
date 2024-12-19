import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "../hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { MyDarkTheme, MyLightTheme } from "@/constants/Colors";
import { AuthContext, AuthProvider } from "@/contexts/auth.context";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { refresh, user } = useContext(AuthContext);
  const { getItem } = useAsyncStorage("hurribrain-access-token");

  const [userLoaded, setUserLoaded] = useState(false);

  const getUser = async () => {
    const value = await getItem();
    if (value !== null) {
      console.log("TOKEN EXISTS", value);
      refresh();
    }
    setUserLoaded(true);
  };

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

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (fontsLoaded && userLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, userLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
        >
          <BackgroundView>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              {user !== null ? (
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
              ) : (
                <Stack.Screen
                  name="(auth)"
                  options={{
                    headerShown: false,
                  }}
                />
              )}
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </BackgroundView>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
