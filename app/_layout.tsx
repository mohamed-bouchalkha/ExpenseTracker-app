import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { NativeBaseProvider } from "native-base";
import { store } from "./utils/store"; // Import your Redux store

export default function RootLayout() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Home" />
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="SignupScreen" />
          <Stack.Screen name="MainScreen" />
          <Stack.Screen name="EmailScreen" />
          <Stack.Screen name="ResetpasswordScreen" />
        </Stack>
      </NativeBaseProvider>
    </Provider>
  );
}
