import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import PlaceholderScreen from '../components/ui/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgetPasswordScreen}
      />

      <Stack.Screen
        name="OtpVerification"
        component={PlaceholderScreen}
      />

      <Stack.Screen
        name="ResetPassword"
        component={PlaceholderScreen}
      />
    </Stack.Navigator>
  );
}