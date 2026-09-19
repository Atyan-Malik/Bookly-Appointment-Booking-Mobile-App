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

function Row({ icon, label, value, last = false }) {
  return (
    <View style={[styles.row, last && styles.lastRow]}>
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>

        <Text style={styles.rowLabel}>
          {label}
        </Text>
      </View>

      <Text
        style={styles.rowValue}
        numberOfLines={2}
      >
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

      const appointment =
        await appointmentService.create({
          professionalId: professional._id,
          serviceId: service._id,
          date,
          startTime,
        });

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
    professional?.name ||
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Confirm your appointment
          </Text>

          <Text style={styles.subtitle}>
            Review your booking details before confirming.
          </Text>
        </View>

        {/* Booking Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Booking details
          </Text>

          <Row
            icon={
              <User
                size={18}
                color={colors.primary}
              />
            }
            label="Professional"
            value={professionalName}
          />

          <Row
            icon={
              <Briefcase
                size={18}
                color={colors.primary}
              />
            }
            label="Service"
            value={serviceName}
          />

          <Row
            icon={
              <Calendar
                size={18}
                color={colors.primary}
              />
            }
            label="Date"
            value={date}
          />

          <Row
            icon={
              <Clock
                size={18}
                color={colors.primary}
              />
            }
            label="Time"
            value={startTime}
          />

          <Row
            icon={
              <Clock
                size={18}
                color={colors.primary}
              />
            }
            label="Duration"
            value={`${service.durationMinutes} min`}
          />

          <Row
            icon={
              <MapPin
                size={18}
                color={colors.primary}
              />
            }
            label="Location"
            value={location}
          />

          <Row
            icon={
              <DollarSign
                size={18}
                color={colors.primary}
              />
            }
            label="Price"
            value={`Rs ${service.price}`}
            last
          />
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <View style={styles.policyDot} />

            <Text style={styles.policyTitle}>
              Cancellation policy
            </Text>
          </View>

          <Text style={styles.policy}>
            You can cancel free of charge up to 24
            hours before your appointment.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 130,
  },

  header: {
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.h2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.bodySecondary,
    lineHeight: 21,
    maxWidth: '95%',
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },

  sectionTitle: {
    ...typography.label,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },

  rowLabel: {
    ...typography.bodySecondary,
    fontSize: 14,
    flexShrink: 1,
  },

  rowValue: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 14,
    maxWidth: '52%',
    textAlign: 'right',
    flexShrink: 1,
  },

  policyCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  policyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },

  policyTitle: {
    ...typography.label,
    fontWeight: '700',
  },

  policy: {
    ...typography.caption,
    lineHeight: 19,
    marginLeft: 15,
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.sm,
  },
});