// navigation/AuthNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
import PlaceholderScreen from "../components/ui/PlaceholderScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Authentication */}
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Password recovery */}
      <Stack.Screen name="ForgotPassword" component={ForgetPasswordScreen} />

      {/* OTP verification */}
      <Stack.Screen name="OtpVerification" component={PlaceholderScreen} />

      {/* Reset password */}
     
      <Stack.Screen name="ResetPassword" component={PlaceholderScreen} />
      
    </Stack.Navigator>
  );
}
