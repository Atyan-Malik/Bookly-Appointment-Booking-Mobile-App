// components/ui/PlaceholderScreen.jsx
// Temporary stand-in so every navigator route resolves to a real component
// during Module 1. Each of these gets replaced screen-by-screen in later modules.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export default function PlaceholderScreen({ route }) {
  const title = route?.name ?? 'Screen';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Coming in a later module</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  },
});
