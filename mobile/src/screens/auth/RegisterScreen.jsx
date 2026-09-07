import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { colors, typography, spacing } from '../../theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import {  radius } from '../../theme';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function RegisterScreen({ navigation }) {
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await authService.register({ ...values, role });
      await setSession(result);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Registration failed', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join to start booking or offering services.</Text>

        <View style={styles.roleRow}>
          {['customer', 'provider'].map((r) => (
            <Text
              key={r}
              onPress={() => setRole(r)}
              style={[styles.rolePill, role === r && styles.rolePillActive]}
            >
              {r === 'customer' ? 'I want to book' : 'I offer services'}
            </Text>
          ))}
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full name"
              placeholder="Your name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
              icon={<User size={18} color={colors.textMuted} />}
            />
          )}
        />

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
              placeholder="At least 8 characters"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry
              icon={<Lock size={18} color={colors.textMuted} />}
            />
          )}
        />

        <Button title="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.md }} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Log in</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   content: { padding: spacing.xl, paddingTop: 60, flexGrow: 1 },
//   title: { ...typography.h1 },
//   subtitle: { ...typography.bodySecondary, marginTop: spacing.xxs, marginBottom: spacing.lg },
//   roleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
//   rolePill: {
//     ...typography.label,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     borderRadius: 999,
//     paddingVertical: spacing.xs,
//     paddingHorizontal: spacing.md,
//     overflow: 'hidden',
//   },
//   rolePillActive: {
//     borderColor: colors.primary,
//     backgroundColor: colors.primaryLight,
//     color: colors.primaryDark,
//     fontWeight: '700',
//   },
//   footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
//   footerText: { ...typography.bodySecondary },
//   link: { ...typography.body, color: colors.primary, fontWeight: '700' },
// });



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 60,
    flexGrow: 1,
  },
 
  title: {
    ...typography.h1,
    // color already comes from typography.h1 -> colors.textPrimary, no override needed
  },
  subtitle: {
    ...typography.bodySecondary,
    // color already comes from typography.bodySecondary -> colors.textSecondary
    marginTop: spacing.xxs,
    marginBottom: spacing.xl,
  },
 
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  rolePill: {
    ...typography.label,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    textAlign: 'center',
  },
  rolePillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    fontWeight: '700',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
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
});