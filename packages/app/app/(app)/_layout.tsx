import { Stack } from "expo-router";

export default function HubStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="lobby"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
