import { Redirect, Stack, Tabs, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import React from "react";

import { useAuth } from "@/contexts/auth.context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const segments = useSegments();

  if (isLoading) {
    return null;
  }

  if (user === null && !isLoading) {
    return <Redirect href="/welcome" />;
  }

  const hideTab = segments.includes("play");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].text,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#00000033",
          borderTopWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
          paddingHorizontal: 16,
          paddingVertical: 32,
          display: hideTab ? "none" : "flex",
        },
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(games)"
        options={{
          title: "Jeux",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="gamecontroller.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
