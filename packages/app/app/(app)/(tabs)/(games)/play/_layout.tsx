import { Stack } from "expo-router";

export default function PlayStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="leaderboard"
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="play"
        options={{
          title: "Play",
        }}
      />
    </Stack>
  );
}
