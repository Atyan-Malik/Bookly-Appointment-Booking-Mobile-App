import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export default function Input({
  label,
  error,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  icon,
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {icon}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.label, marginBottom: spacing.xxs },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  inputWrapperFocused: { borderColor: colors.primary },
  inputWrapperError: { borderColor: colors.error },
  input: { flex: 1, ...typography.bodyLarge, color: colors.textPrimary },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xxs },
});