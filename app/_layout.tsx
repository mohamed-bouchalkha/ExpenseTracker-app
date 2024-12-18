import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle:"Home"
      }} />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="SignupScreen" />
      <Stack.Screen name="MainScreen" />

    </Stack>
  );
}
