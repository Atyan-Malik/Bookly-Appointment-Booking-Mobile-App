import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  CalendarX,
  CalendarDays,
} from 'lucide-react-native';

import { colors, typography, spacing } from '../../theme';
import { useAppointmentStore } from '../../store/appointmentStore';
import AppointmentCard from '../../components/cards/AppointmentCard';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

const STATUSES = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
];

export default function ProviderAppointmentsScreen({ navigation }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const {
    appointments,
    isLoading,
    fetchAppointments,
  } = useAppointmentStore();

  const load = useCallback(() => {
    return fetchAppointments(
      statusFilter === 'ALL' ? undefined : statusFilter
    );
  }, [fetchAppointments, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);

    load().finally(() => {
      setRefreshing(false);
    });
  };

  const handleAppointmentPress = (appointment) => {
    const appointmentId = appointment?._id || appointment?.id;

    if (!appointmentId) {
      console.error(
        'Cannot open appointment: missing appointment ID',
        appointment
      );
      return;
    }

    navigation.navigate('ProviderAppointmentDetail', {
      id: appointmentId,
    });
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.eyebrow}>
            PROVIDER DASHBOARD
          </Text>

          <Text style={styles.title}>
            Appointments
          </Text>

          <Text style={styles.subtitle}>
            Manage your customer bookings
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <CalendarDays
            size={21}
            color={colors.primary}
            strokeWidth={2}
          />
        </View>
      </View>

      {/* ================= STATUS FILTER ================= */}
      <View style={styles.filterSection}>
        <View style={styles.filterBar}>
          {STATUSES.map((status) => {
            const active = statusFilter === status;

            return (
              <TouchableOpacity
                key={status}
                activeOpacity={0.8}
                onPress={() => setStatusFilter(status)}
                style={[
                  styles.filterButton,
                  active && styles.filterButtonActive,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ================= LIST HEADER ================= */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>
          {statusFilter === 'ALL'
            ? 'All Appointments'
            : `${statusFilter.charAt(0)}${statusFilter
                .slice(1)
                .toLowerCase()} Appointments`}
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {appointments.length}
          </Text>
        </View>
      </View>

      {/* ================= CONTENT ================= */}
      <View style={styles.content}>
        {isLoading && !refreshing ? (
          <LoadingState />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon={
                <View style={styles.emptyIcon}>
                  <CalendarX
                    size={34}
                    color={colors.textMuted}
                    strokeWidth={1.7}
                  />
                </View>
              }
              title={
                statusFilter === 'ALL'
                  ? 'No appointments yet'
                  : `No ${statusFilter.toLowerCase()} appointments`
              }
            />

            <Text style={styles.emptyDescription}>
              {statusFilter === 'ALL'
                ? 'Appointments from your customers will appear here.'
                : `There are no ${statusFilter.toLowerCase()} appointments at the moment.`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(appointment) =>
              appointment?._id || appointment?.id
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => (
              <AppointmentCard
                appointment={item}
                isProviderView
                onPress={() => handleAppointmentPress(item)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ================= CONTAINER ================= */

  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 54,
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 18,
  },

  headerContent: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.primary,
    marginBottom: 4,
  },

  title: {
    ...typography.h2,
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  /* ================= FILTER ================= */

  filterSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: 18,
  },

  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 11,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButton: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderRadius: 8,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textMuted,
  },

  filterTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  /* ================= LIST HEADER ================= */

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: 8,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  countBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  /* ================= CONTENT ================= */

  content: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
    paddingBottom: spacing.xl * 2,
  },

  /* ================= EMPTY ================= */

  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyDescription: {
    maxWidth: 280,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 19,
    color: colors.textMuted,
  },
});