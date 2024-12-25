import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
