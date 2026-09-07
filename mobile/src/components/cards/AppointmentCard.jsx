import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import Badge from '../ui/Badge';

const STATUS_TONE = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'info',
  CANCELLED: 'error',
  NO_SHOW: 'neutral',
};

export default function AppointmentCard({ appointment, onPress, isProviderView }) {
  const name = isProviderView
    ? appointment.customer?.name
    : appointment.professional?.user?.name;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Badge label={appointment.status} tone={STATUS_TONE[appointment.status] || 'default'} />
      </View>

      <Text style={styles.service}>{appointment.service?.name}</Text>

      <View style={styles.row}>
        <View style={styles.metaItem}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{appointment.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{appointment.startTime}</Text>
        </View>
      </View>

      <Text style={styles.price}>Rs {appointment.price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.h4, flex: 1, marginRight: spacing.sm },
  service: { ...typography.bodySecondary, marginTop: 4 },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.caption, color: colors.textSecondary },
  price: { ...typography.label, color: colors.primaryDark, fontWeight: '700', marginTop: spacing.xs },
});