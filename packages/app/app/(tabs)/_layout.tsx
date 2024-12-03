import { Tabs } from "expo-router";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
        },
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: "Games",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="gamecontroller.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
