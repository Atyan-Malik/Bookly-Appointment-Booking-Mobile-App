import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Calendar,
  Clock,
  MapPin,
  Timer,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from '../../theme';

import appointmentService from '../../services/appointmentService';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const STATUS_TONE = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'info',
  CANCELLED: 'error',
  NO_SHOW: 'neutral',
};

const CANCELLABLE_STATUSES = [
  'PENDING',
  'CONFIRMED',
];

export default function AppointmentDetailScreen({
  route,
  navigation,
}) {
  const { id } = route.params;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  /*
   * Load appointment details
   */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result =
        await appointmentService.getById(id);

      setAppointment(result);
    } catch (err) {
      console.error(
        'Get appointment detail error:',
        err
      );

      setError(
        err?.message ||
          'Failed to load appointment'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  /*
   * Cancel appointment
   */
  const onCancel = useCallback(() => {
    if (!appointment) {
      return;
    }

    Alert.alert(
      'Cancel appointment?',
      'This action cannot be undone.',
      [
        {
          text: 'Keep it',
          style: 'cancel',
        },
        {
          text: 'Cancel appointment',
          style: 'destructive',

          onPress: async () => {
            try {
              setCancelling(true);

              const updated =
                await appointmentService.cancel(id);

              setAppointment(updated);

              Toast.show({
                type: 'success',
                text1: 'Appointment cancelled',
              });
            } catch (err) {
              console.error(
                'Cancel appointment error:',
                err
              );

              Toast.show({
                type: 'error',
                text1: 'Could not cancel',
                text2:
                  err?.message ||
                  'Please try again.',
              });
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  }, [appointment, id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={load}
      />
    );
  }

  if (!appointment) {
    return (
      <ErrorState
        message="Appointment not found"
        onRetry={load}
      />
    );
  }

  const canCancel =
    CANCELLABLE_STATUSES.includes(
      appointment.status
    );

  const professionalName =
    appointment.professional?.user?.name ||
    'Professional';

  const profession =
    appointment.professional?.profession ||
    '';

  const serviceName =
    appointment.service?.name ||
    'Service';

  const location =
    appointment.professional?.location?.city ||
    appointment.professional?.location?.address ||
    'Location not provided';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {professionalName}
            </Text>

            {profession ? (
              <Text style={styles.profession}>
                {profession}
              </Text>
            ) : null}
          </View>

          <Badge
            label={appointment.status}
            tone={
              STATUS_TONE[
                appointment.status
              ] || 'neutral'
            }
          />
        </View>

        {/* Appointment information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Appointment Details
          </Text>

          <View style={styles.row}>
            <Calendar
              size={17}
              color={colors.textMuted}
            />

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Date
              </Text>

              <Text style={styles.rowText}>
                {appointment.date}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Clock
              size={17}
              color={colors.textMuted}
            />

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Time
              </Text>

              <Text style={styles.rowText}>
                {appointment.startTime} -{' '}
                {appointment.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Timer
              size={17}
              color={colors.textMuted}
            />

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Duration
              </Text>

              <Text style={styles.rowText}>
                {appointment.durationMinutes}{' '}
                minutes
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.row,
              styles.lastRow,
            ]}
          >
            <MapPin
              size={17}
              color={colors.textMuted}
            />

            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>
                Location
              </Text>

              <Text style={styles.rowText}>
                {location}
              </Text>
            </View>
          </View>
        </View>

        {/* Service */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Service
          </Text>

          <Text style={styles.serviceName}>
            {serviceName}
          </Text>

          {appointment.service?.description ? (
            <Text style={styles.description}>
              {appointment.service.description}
            </Text>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Total
            </Text>

            <Text style={styles.price}>
              Rs {appointment.price}
            </Text>
          </View>
        </View>

        {/* Customer notes */}
        {appointment.notes ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Your Notes
            </Text>

            <Text style={styles.notes}>
              {appointment.notes}
            </Text>
          </View>
        ) : null}

        {/* Cancellation information */}
        {appointment.status === 'CANCELLED' &&
        appointment.cancellationReason ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Cancellation Reason
            </Text>

            <Text style={styles.notes}>
              {appointment.cancellationReason}
            </Text>
          </View>
        ) : null}

        {/* Policy */}
        {canCancel ? (
          <Text style={styles.policy}>
            Cancellation policy: free cancellation
            up to 24 hours before your appointment
            time.
          </Text>
        ) : null}
      </ScrollView>

      {/* Footer */}
      {canCancel && (
        <View style={styles.footer}>
          <Button
            title="Cancel Appointment"
            variant="outline"
            onPress={onCancel}
            loading={cancelling}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  headerContent: {
    flex: 1,
    marginRight: spacing.sm,
  },

  title: {
    ...typography.h2,
  },

  profession: {
    ...typography.bodySecondary,
    marginTop: 2,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  lastRow: {
    marginBottom: 0,
  },

  rowContent: {
    flex: 1,
  },

  rowLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },

  rowText: {
    ...typography.body,
    color: colors.textPrimary,
  },

  serviceName: {
    ...typography.h4,
  },

  description: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  priceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },

  price: {
    ...typography.h3,
    color: colors.primaryDark,
  },

  notes: {
    ...typography.body,
    lineHeight: 21,
  },

  policy: {
    ...typography.caption,
    lineHeight: 18,
    color: colors.textMuted,
  },

  footer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});