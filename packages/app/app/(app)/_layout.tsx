import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import React, { useEffect } from "react";

import { useAuth } from "@/contexts/auth.context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user === null && !isLoading) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
