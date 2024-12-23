import { Stack } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log("we are at least going there; index");
  }, []);

  return (
    <>
      <Stack.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
    </>
  );
}
