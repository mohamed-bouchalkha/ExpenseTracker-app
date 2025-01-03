import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { NativeBaseProvider } from "native-base";
import { store } from "./utils/store"; // Import your Redux store
import NotificationProvider from "./NotificationManager";

export default function RootLayout() {
  return (
    <Provider store={store}>
    <NativeBaseProvider>
    <NotificationProvider>
      <Stack>
        <Stack.Screen name="index"options={{headerShown: false, }}/> 
        <Stack.Screen name="ChangePasswordScreen" />
        <Stack.Screen name="Home" options={{headerShown: false,}}/>
        <Stack.Screen name="LoginScreen" options={{headerShown: false,}}/>
        <Stack.Screen name="SignupScreen"options={{headerShown: false,}} />
        <Stack.Screen name="MainScreen" options={{headerShown: false,}} />
        <Stack.Screen name="EmailScreen"/>
        <Stack.Screen name="ResetpasswordScreen"/>
        <Stack.Screen name="VerifyEmailScreen" />
        <Stack.Screen name="AddExpence"options={{headerShown: false,}}/>
        <Stack.Screen name="AddCatgory"/>
        <Stack.Screen name="HistoryPage" options={{headerShown: false,}} />
        <Stack.Screen name="GraphReportScreen"options={{headerShown: false,}} />
        <Stack.Screen name="Changepassword" />
        <Stack.Screen name="ProfileScreen"options={{headerShown: false,}}/>
        <Stack.Screen name="EditExpence" options={{headerShown: false,}}/>
        <Stack.Screen name="VerificationCodeScreen"options={{headerShown: false,}}/>
        <Stack.Screen name="CodeverificationforForgetpass"options={{headerShown: false,}}/>
        <Stack.Screen name="SetGoalScreen"options={{headerShown: false,}}/>
        <Stack.Screen name="AboutScreen"options={{headerShown: false,}}/>
        <Stack.Screen name="Editgoals" options={{headerShown: false,}}/>
      </Stack>
      </NotificationProvider>
    </NativeBaseProvider>
  </Provider>
  );
}
