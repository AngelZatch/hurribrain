import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import React, { useEffect } from "react";

import { useAuth } from "@/contexts/auth.context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("we are at least going there; app layout");
  }, []);

  if (!isLoading) {
    return null;
  }

  if (!user) {
    <Redirect href="/register" />;
  }

  return <Stack />;
}
