// components/forms/RatingInput.jsx
// Tappable 1-5 star selector used on the leave-a-review form (Module 9 /
// reviewSchemas.js's reviewSchema expects `rating: number`).
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';

export default function RatingInput({ value = 0, onChange, size = 32, error }) {
  return (
    <View>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)} hitSlop={6}>
            <Star
              size={size}
              color={colors.warning}
              fill={n <= value ? colors.warning : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xxs },
});
