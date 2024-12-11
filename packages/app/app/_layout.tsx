import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "../hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useMemo } from "react";
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
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
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { token } = useContext(AuthContext);

  console.log(token);

  const authContext = useMemo(
    () => ({
      signIn: async () => {
        console.log("Sign in");
      },
      signOut: async () => {
        console.log("Sign out");
      },
    }),
    []
  );

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
      >
        <BackgroundView>
          {token !== null ? (
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          ) : (
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          )}
          <StatusBar style="auto" />
        </BackgroundView>
      </ThemeProvider>
    </AuthProvider>
  );
}
