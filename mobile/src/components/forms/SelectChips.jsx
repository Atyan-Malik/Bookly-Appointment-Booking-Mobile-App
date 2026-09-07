// components/forms/SelectChips.jsx
// Generic single- or multi-select chip group, backing both filter UIs
// (Discover screen category/sort chips) and form fields (e.g. picking a
// professional's gender preference in search filters). Extracted here so
// that styling only needs to change in one place.
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export default function SelectChips({ options, value, onChange, multi = false, getLabel = (o) => o.label, getId = (o) => o.id }) {
  const isSelected = (option) =>
    multi ? (value || []).includes(getId(option)) : value === getId(option);

  const handlePress = (option) => {
    const id = getId(option);
    if (multi) {
      const current = value || [];
      onChange(current.includes(id) ? current.filter((v) => v !== id) : [...current, id]);
    } else {
      onChange(value === id ? null : id);
    }
  };

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const selected = isSelected(option);
        return (
          <TouchableOpacity
            key={getId(option)}
            onPress={() => handlePress(option)}
            style={[styles.chip, selected && styles.chipActive]}
          >
            <Text style={[styles.text, selected && styles.textActive]}>{getLabel(option)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { ...typography.label, color: colors.textSecondary },
  textActive: { color: colors.white, fontWeight: '700' },
});
