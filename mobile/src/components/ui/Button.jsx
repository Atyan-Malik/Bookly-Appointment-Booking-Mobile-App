import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, typography, spacing } from '../../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | ghost
  disabled = false,
  loading = false,
  style,
}) {
  const isPrimary = variant === 'primary';

  const content = loading ? (
    <ActivityIndicator color={isPrimary ? colors.white : colors.primary} />
  ) : (
    <Text
      style={[
        styles.text,
        variant === 'outline' || variant === 'ghost'
          ? { color: colors.primary }
          : { color: colors.white },
      ]}
    >
      {title}
    </Text>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled || loading}
        onPress={onPress}
        style={[style, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={colors.gradients.primaryButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.transparent,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
});
