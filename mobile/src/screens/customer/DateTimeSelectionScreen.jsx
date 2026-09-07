import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, addDays } from 'date-fns';
import { colors, typography, spacing, radius } from '../../theme';
import professionalService from '../../services/professionalService';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';

const DAYS_AHEAD = 14;

function groupSlots(slots) {
  const groups = { Morning: [], Afternoon: [], Evening: [] };
  slots.forEach((s) => {
    const hour = Number(s.time.split(':')[0]);
    if (hour < 12) groups.Morning.push(s);
    else if (hour < 17) groups.Afternoon.push(s);
    else groups.Evening.push(s);
  });
  return groups;
}

export default function DateTimeSelectionScreen({ route, navigation }) {
  const { professional, service } = route.params;

  const dates = useMemo(
    () => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(new Date(), i)),
    []
  );

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSelectedTime(null);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    professionalService
      .getAvailability(professional._id, dateStr, service.durationMinutes)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [selectedDate, professional._id, service.durationMinutes]);

  const grouped = groupSlots(slots);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a date & time</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
        {dates.map((d) => {
          const active = format(d, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          return (
            <TouchableOpacity
              key={d.toISOString()}
              onPress={() => setSelectedDate(d)}
              style={[styles.dateChip, active && styles.dateChipActive]}
            >
              <Text style={[styles.dateDay, active && styles.dateTextActive]}>{format(d, 'EEE')}</Text>
              <Text style={[styles.dateNum, active && styles.dateTextActive]}>{format(d, 'd')}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <LoadingState />
      ) : (
        <ScrollView style={styles.slotsScroll} contentContainerStyle={{ paddingBottom: 140 }}>
          {Object.entries(grouped).map(([label, group]) =>
            group.length === 0 ? null : (
              <View key={label} style={styles.group}>
                <Text style={styles.groupLabel}>{label}</Text>
                <View style={styles.slotGrid}>
                  {group.map((s) => (
                    <TouchableOpacity
                      key={s.time}
                      disabled={!s.available}
                      onPress={() => setSelectedTime(s.time)}
                      style={[
                        styles.slot,
                        !s.available && styles.slotDisabled,
                        selectedTime === s.time && styles.slotSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          !s.available && styles.slotTextDisabled,
                          selectedTime === s.time && styles.slotTextSelected,
                        ]}
                      >
                        {s.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )
          )}
          {slots.length === 0 && (
            <Text style={styles.noSlots}>No availability on this date. Try another day.</Text>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!selectedTime}
          onPress={() =>
            navigation.navigate('BookingConfirmation', {
              professional,
              service,
              date: format(selectedDate, 'yyyy-MM-dd'),
              startTime: selectedTime,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  title: { ...typography.h2, marginHorizontal: spacing.lg, marginBottom: spacing.md },
  dateRow: { flexGrow: 0, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  dateChip: {
    width: 56, height: 68, borderRadius: radius.md, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dateChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateDay: { ...typography.caption },
  dateNum: { ...typography.h4, marginTop: 2 },
  dateTextActive: { color: colors.white },
  slotsScroll: { paddingHorizontal: spacing.lg },
  group: { marginBottom: spacing.lg },
  groupLabel: { ...typography.label, marginBottom: spacing.sm, fontWeight: '700' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card,
  },
  slotSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotDisabled: { backgroundColor: colors.background, borderColor: colors.border, opacity: 0.4 },
  slotText: { ...typography.label, color: colors.textPrimary },
  slotTextSelected: { color: colors.white, fontWeight: '700' },
  slotTextDisabled: { color: colors.textMuted, textDecorationLine: 'line-through' },
  noSlots: { ...typography.bodySecondary, textAlign: 'center', marginTop: spacing.xxl },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg,
    backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border,
  },
});
