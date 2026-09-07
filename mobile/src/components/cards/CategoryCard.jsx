
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import * as Icons from 'lucide-react-native';

import {
  colors,
  radius,
  spacing,
  typography,
} from '../../theme';

export default function CategoryCard({
  category,
  selected,
  onPress,
}) {
  const Icon =
    Icons[category.icon] || Icons.Briefcase;

  const label =
    category.name || category.label;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.cardSelected,
      ]}
    >
      <Icon
        size={22}
        color={
          selected
            ? colors.white
            : colors.primary
        }
      />

      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[
          styles.label,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // CARD
  // ==========================================

  card: {
    alignItems: 'center',
    justifyContent: 'center',

    // Fixed width keeps every category
    // visually consistent.
    width: 100,
    height: 96,

    borderRadius: radius.lg,

    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    // Space between icon and text
    gap: spacing.xs,

    // Prevent text/content from visually
    // pushing outside the card.
    overflow: 'hidden',
  },

  // ==========================================
  // SELECTED
  // ==========================================

  cardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // ==========================================
  // LABEL
  // ==========================================

  label: {
    ...typography.caption,

    color: colors.textSecondary,

    fontWeight: '600',

    textAlign: 'center',

    // Important:
    // gives two-word / multi-word categories
    // enough room to wrap naturally.
    width: 84,

    lineHeight: 16,

    // Keeps text from becoming too large
    // for the card.
    paddingHorizontal: 2,
  },

  labelSelected: {
    color: colors.white,
  },
});
