import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { CalendarX } from 'lucide-react-native';

import { colors, typography, spacing } from '../../theme';
import { useAppointmentStore } from '../../store/appointmentStore';

import AppointmentCard from '../../components/cards/AppointmentCard';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

const TABS = [
  {
    key: 'upcoming',
    label: 'Upcoming',
    statuses: ['PENDING', 'CONFIRMED'],
  },
  {
    key: 'completed',
    label: 'Completed',
    statuses: ['COMPLETED'],
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    statuses: ['CANCELLED', 'NO_SHOW'],
  },
];

export default function AppointmentsScreen({ navigation }) {
  const [tab, setTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const {
    appointments = [],
    isLoading,
    fetchAppointments,
  } = useAppointmentStore();

  /*
   * Fetch customer's appointments
   */
  const load = useCallback(async () => {
    try {
      setError(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Fetch appointments error:', err);

      setError(
        err?.message || 'Failed to load appointments'
      );
    }
  }, [fetchAppointments]);

  /*
   * Initial load
   */
  useEffect(() => {
    load();
  }, [load]);

  /*
   * Pull to refresh
   */
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      await fetchAppointments();
    } catch (err) {
      console.error('Refresh appointments error:', err);

      setError(
        err?.message || 'Failed to refresh appointments'
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchAppointments]);

  /*
   * Filter appointments according to active tab
   */
  const filteredAppointments = useMemo(() => {
    const activeTab = TABS.find(
      (item) => item.key === tab
    );

    if (!activeTab) {
      return [];
    }

    return appointments.filter((appointment) =>
      activeTab.statuses.includes(appointment.status)
    );
  }, [appointments, tab]);

  /*
   * Open appointment details
   */
  const handleAppointmentPress = useCallback(
    (appointment) => {
      navigation.navigate('AppointmentDetail', {
        id: appointment._id,
      });
    },
    [navigation]
  );

  /*
   * Render appointment
   */
  const renderAppointment = useCallback(
    ({ item }) => (
      <AppointmentCard
        appointment={item}
        onPress={() =>
          handleAppointmentPress(item)
        }
      />
    ),
    [handleAppointmentPress]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>
        My Appointments
      </Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((item) => {
          const isActive = tab === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setTab(item.key)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {item.label}
              </Text>

              {isActive && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Loading */}
      {isLoading && !refreshing ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={load}
        />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={
            <CalendarX
              size={48}
              color={colors.textMuted}
            />
          }
          title="No appointments here"
          subtitle={
            tab === 'upcoming'
              ? 'Book a professional to see your upcoming appointments here.'
              : tab === 'completed'
              ? 'Completed appointments will appear here.'
              : 'Cancelled appointments will appear here.'
          }
        />
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(appointment) =>
            appointment._id
          }
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing.xxl,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={renderAppointment}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },

  title: {
    ...typography.h2,
    marginHorizontal: spacing.lg,
  },

  tabRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: {
    marginRight: spacing.lg,
    paddingBottom: spacing.sm,
  },

  tabText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '600',
  },

  tabTextActive: {
    color: colors.primary,
  },

  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
    borderRadius: 2,
  },
});