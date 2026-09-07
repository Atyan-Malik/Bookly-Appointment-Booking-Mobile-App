import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { colors, typography, spacing,radius } from '../../theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { APP_NAME } from '../../constants';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginScreen({ navigation }) {
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await authService.login(values);
      await setSession(result);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: e.message || 'Check your credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>{APP_NAME}</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to book your next appointment.</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              icon={<Mail size={18} color={colors.textMuted} />}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry
              icon={<Lock size={18} color={colors.textMuted} />}
            />
          )}
        />

        <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot password?
        </Text>

        <Button title="Log In" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.md }} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Sign up</Text>
        </View>

        <Text style={styles.demoHint}>
          Demo: customer@bookly.dev / Password123
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   content: { padding: spacing.xl, paddingTop: 80, flexGrow: 1 },
//   brand: { ...typography.h3, color: colors.primary, marginBottom: spacing.xl },
//   title: { ...typography.h1 },
//   subtitle: { ...typography.bodySecondary, marginTop: spacing.xxs, marginBottom: spacing.xl },
//   forgot: { ...typography.label, color: colors.primary, textAlign: 'right', marginBottom: spacing.sm },
//   footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
//   footerText: { ...typography.bodySecondary },
//   link: { ...typography.body, color: colors.primary, fontWeight: '700' },
//   demoHint: { ...typography.caption, textAlign: 'center', marginTop: spacing.lg },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 80,
    flexGrow: 1,
  },
 
  brand: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.xl,
  },
 
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.label,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xxs,
  },
 
  forgot: {
    ...typography.label,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
 
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.primaryLight,
    shadowOpacity: 0,
    elevation: 0,
  },
 
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
  },
 
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  socialButtonText: {
    ...typography.label,
    fontWeight: '600',
  },
 
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.bodySecondary,
  },
  link: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
 
  demoHint: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    alignSelf: 'center',
  },
});