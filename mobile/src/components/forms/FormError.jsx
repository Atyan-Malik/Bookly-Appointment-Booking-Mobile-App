// components/forms/FormError.jsx
// Form-level (as opposed to per-field) error banner — e.g. "Invalid email or
// password" returned from the API after submit, which isn't tied to one
// input. Field-level errors still render inline via ui/Input's `error` prop.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '../../theme';

export default function FormError({ message }) {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <AlertCircle size={16} color={colors.error} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  text: { ...typography.body, color: colors.error, flex: 1 },
});
