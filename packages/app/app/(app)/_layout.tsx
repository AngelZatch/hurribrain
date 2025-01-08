import { Stack } from "expo-router";

export default function HubStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="lobby"
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
