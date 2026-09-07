import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import providerService from '../../services/providerService';
import LoadingState from '../../components/ui/LoadingState';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CalendarScreen() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState(null);

  useEffect(() => {
    providerService
      .getMyAvailability()
      .then((data) => {
        // Ensure all 7 days are represented even if not yet saved
        const byDay = Object.fromEntries(data.map((d) => [d.dayOfWeek, d]));
        const full = DAY_LABELS.map((_, i) => byDay[i] || { dayOfWeek: i, startTime: '09:00', endTime: '17:00', isClosed: i === 0 });
        setAvailability(full);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleClosed = async (dayOfWeek) => {
    const day = availability.find((d) => d.dayOfWeek === dayOfWeek);
    const updatedIsClosed = !day.isClosed;
    setSavingDay(dayOfWeek);
    try {
      await providerService.updateAvailability({
        dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        isClosed: updatedIsClosed,
      });
      setAvailability((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, isClosed: updatedIsClosed } : d)));
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Could not update availability' });
    } finally {
      setSavingDay(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Working Hours</Text>
      <Text style={styles.subtitle}>Toggle days closed. Time editing coming soon — hours default to 9:00–17:00.</Text>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {availability.map((day) => (
          <View key={day.dayOfWeek} style={styles.dayCard}>
            <View>
              <Text style={styles.dayLabel}>{DAY_LABELS[day.dayOfWeek]}</Text>
              <Text style={styles.hours}>
                {day.isClosed ? 'Closed' : `${day.startTime} – ${day.endTime}`}
              </Text>
            </View>
            <Switch
              value={!day.isClosed}
              onValueChange={() => toggleClosed(day.dayOfWeek)}
              disabled={savingDay === day.dayOfWeek}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  title: { ...typography.h2, marginHorizontal: spacing.lg },
  subtitle: { ...typography.bodySecondary, marginHorizontal: spacing.lg, marginTop: 4 },
  dayCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadows.sm,
  },
  dayLabel: { ...typography.h4, fontSize: 15 },
  hours: { ...typography.caption, marginTop: 2 },
});
