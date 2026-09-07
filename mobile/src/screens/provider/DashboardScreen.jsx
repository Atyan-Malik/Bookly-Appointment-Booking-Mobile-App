import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { CalendarCheck, TrendingUp, Star, Clock } from 'lucide-react-native';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import LoadingState from '../../components/ui/LoadingState';
import AppointmentCard from '../../components/cards/AppointmentCard';

function StatCard({ icon, label, value }) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);
  const { appointments, isLoading, fetchAppointments } = useAppointmentStore();

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todays = useMemo(() => appointments.filter((a) => a.date === today), [appointments, today]);
  const upcoming = useMemo(
    () => appointments.filter((a) => a.date > today && ['PENDING', 'CONFIRMED'].includes(a.status)),
    [appointments, today]
  );
  const revenue = useMemo(
    () => appointments.filter((a) => a.status === 'COMPLETED').reduce((sum, a) => sum + a.price, 0),
    [appointments]
  );

  if (isLoading) return <LoadingState />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0]} 👋</Text>
      <Text style={styles.subtitle}>Here's how things look today.</Text>

      <View style={styles.statsGrid}>
        <StatCard icon={<CalendarCheck size={20} color={colors.primary} />} label="Today" value={todays.length} />
        <StatCard icon={<Clock size={20} color={colors.secondary} />} label="Upcoming" value={upcoming.length} />
        <StatCard icon={<TrendingUp size={20} color={colors.success} />} label="Revenue" value={`Rs ${revenue}`} />
        <StatCard icon={<Star size={20} color={colors.warning} />} label="Total Booked" value={appointments.length} />
      </View>

      <Text style={styles.sectionTitle}>Today's appointments</Text>
      {todays.length === 0 ? (
        <Text style={styles.empty}>No appointments scheduled for today.</Text>
      ) : (
        todays.map((a) => (
          <AppointmentCard
            key={a._id}
            appointment={a}
            isProviderView
            onPress={() => navigation.navigate('ProviderAppointmentDetail', { id: a._id })}
          />
        ))
      )}

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, paddingHorizontal: spacing.lg },
  greeting: { ...typography.h2 },
  subtitle: { ...typography.bodySecondary, marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: {
    width: '47%', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, ...shadows.sm,
  },
  statValue: { ...typography.h2, marginTop: spacing.xs },
  statLabel: { ...typography.caption },
  sectionTitle: { ...typography.h4, marginBottom: spacing.sm },
  empty: { ...typography.bodySecondary },
});
