import { Stack } from "expo-router";

export default function GamesStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="games"
        options={{
          title: "Games",
        }}
      />
    </Stack>
  );
}
