import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Briefcase,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from '../../theme';

import Button from '../../components/ui/Button';
import appointmentService from '../../services/appointmentService';

function Row({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}

        <Text style={styles.rowLabel}>
          {label}
        </Text>
      </View>

      <Text style={styles.rowValue}>
        {value || 'Not provided'}
      </Text>
    </View>
  );
}

export default function BookingConfirmationScreen({
  route,
  navigation,
}) {
  const {
    professional,
    service,
    date,
    startTime,
  } = route.params;

  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      /*
       * Only send IDs and booking information.
       *
       * Do NOT send:
       * - customerId
       * - price
       * - durationMinutes
       * - endTime
       *
       * The backend should derive/validate those.
       */
      const appointment =
        await appointmentService.create({
          professionalId: professional._id,
          serviceId: service._id,
          date,
          startTime,
        });

      /*
       * Backend-created appointment is now
       * the source of truth.
       */
      navigation.replace('BookingSuccess', {
        appointment,
      });
    } catch (error) {
      console.error(
        'Create appointment error:',
        error
      );

      Toast.show({
        type: 'error',
        text1: 'Could not book appointment',
        text2:
          error?.message ||
          'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const professionalName =
    professional?.user?.name ||
    'Professional';

  const serviceName =
    service?.name ||
    'Service';

  const location =
    professional?.location?.city ||
    professional?.location?.address ||
    'Location not provided';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Confirm your appointment
        </Text>

        <Text style={styles.subtitle}>
          Review your booking details before
          confirming.
        </Text>

        <View style={styles.card}>
          <Row
            icon={
              <User
                size={17}
                color={colors.textMuted}
              />
            }
            label="Professional"
            value={professionalName}
          />

          <Row
            icon={
              <Briefcase
                size={17}
                color={colors.textMuted}
              />
            }
            label="Service"
            value={serviceName}
          />

          <Row
            icon={
              <Calendar
                size={17}
                color={colors.textMuted}
              />
            }
            label="Date"
            value={date}
          />

          <Row
            icon={
              <Clock
                size={17}
                color={colors.textMuted}
              />
            }
            label="Time"
            value={startTime}
          />

          <Row
            icon={
              <Clock
                size={17}
                color={colors.textMuted}
              />
            }
            label="Duration"
            value={`${service.durationMinutes} min`}
          />

          <Row
            icon={
              <MapPin
                size={17}
                color={colors.textMuted}
              />
            }
            label="Location"
            value={location}
          />

          <View style={styles.lastRow}>
            <Row
              icon={
                <DollarSign
                  size={17}
                  color={colors.textMuted}
                />
              }
              label="Price"
              value={`Rs ${service.price}`}
            />
          </View>
        </View>

        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>
            Cancellation policy
          </Text>

          <Text style={styles.policy}>
            You can cancel free of charge up to
            24 hours before your appointment.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirm Appointment"
          onPress={confirm}
          loading={loading}
          disabled={loading}
        />
      </View>
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

  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.bodySecondary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },

  rowLabel: {
    ...typography.bodySecondary,
  },

  rowValue: {
    ...typography.body,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  policyCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },

  policyTitle: {
    ...typography.label,
    marginBottom: spacing.xs,
  },

  policy: {
    ...typography.caption,
    lineHeight: 18,
  },

  footer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});