// navigation/AuthNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlaceholderScreen from '../components/ui/PlaceholderScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      {/* OTP / reset-password-with-token screens plug in once email delivery is configured */}
      <Stack.Screen name="OtpVerification" component={PlaceholderScreen} />
      <Stack.Screen name="ResetPassword" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

