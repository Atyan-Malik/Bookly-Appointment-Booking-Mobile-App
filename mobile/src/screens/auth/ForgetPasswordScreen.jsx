import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { colors, typography, spacing } from '../../theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) {
      Toast.show({ type: 'error', text1: 'Enter a valid email' });
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Something went wrong', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>
        {sent
          ? "If an account exists for that email, we've sent a reset link."
          : "Enter your email and we'll send you a reset link."}
      </Text>

      {!sent && (
        <>
          <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Button title="Send Reset Link" onPress={submit} loading={loading} />
        </>
      )}

      <Text style={styles.back} onPress={() => navigation.goBack()}>Back to login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, paddingTop: 100 },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySecondary, marginTop: spacing.xxs, marginBottom: spacing.xl },
  back: { ...typography.body, color: colors.primary, fontWeight: '700', textAlign: 'center', marginTop: spacing.xl },
});


// navigation/AuthNavigator.jsx
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import PlaceholderScreen from '../components/ui/PlaceholderScreen';
// import OnboardingScreen from '../screens/auth/OnboardingScreen';
// import LoginScreen from '../screens/auth/LoginScreen';
// import RegisterScreen from '../screens/auth/RegisterScreen';
// import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// const Stack = createNativeStackNavigator();

// export default function AuthNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
//       <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//       {/* OTP / reset-password-with-token screens plug in once email delivery is configured */}
//       <Stack.Screen name="OtpVerification" component={PlaceholderScreen} />
//       <Stack.Screen name="ResetPassword" component={PlaceholderScreen} />
//     </Stack.Navigator>
//   );
// }

