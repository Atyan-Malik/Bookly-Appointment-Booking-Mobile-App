import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export default function Badge({ label, tone = 'default' }) {
  const toneColors = {
    default: { bg: colors.primaryLight, text: colors.primaryDark },
    success: { bg: colors.successLight, text: colors.success },
    warning: { bg: colors.warningLight, text: colors.warning },
    error: { bg: colors.errorLight, text: colors.error },
    info: { bg: colors.infoLight, text: colors.info },
    neutral: { bg: colors.border, text: colors.textSecondary },
  };
  const { bg, text } = toneColors[tone] || toneColors.default;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});