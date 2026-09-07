import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import Button from './Button';

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel ? (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  title: { ...typography.h4, marginTop: spacing.md, textAlign: 'center' },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xxs,
    textAlign: 'center',
  },
  button: { marginTop: spacing.lg, minWidth: 180 },
});