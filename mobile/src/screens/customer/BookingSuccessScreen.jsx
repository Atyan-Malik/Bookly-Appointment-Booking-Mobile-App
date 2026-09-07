import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Receipt,
} from 'lucide-react-native';

import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from '../../theme';

import Button from '../../components/ui/Button';

export default function BookingSuccessScreen({
  route,
  navigation,
}) {
  const { appointment } = route.params;

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>
          Booking information unavailable
        </Text>

        <Button
          title="Back to Home"
          onPress={() =>
            navigation.navigate('CustomerApp', {
              screen: 'Home',
            })
          }
          style={styles.fullButton}
        />
      </View>
    );
  }

  const appointmentId = appointment._id
    ? appointment._id.slice(-8).toUpperCase()
    : 'N/A';

  const professionalName =
    appointment.professional?.user?.name ||
    'Professional';

  const serviceName =
    appointment.service?.name ||
    'Service';

  const location =
    appointment.professional?.location?.city ||
    appointment.professional?.location?.address ||
    'Location not provided';

  return (
    <View style={styles.container}>
      {/* Success icon */}
      <View style={styles.iconContainer}>
        <CheckCircle2
          size={80}
          color={colors.success}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Appointment Confirmed!
      </Text>

      <Text style={styles.subtitle}>
        Your appointment has been successfully booked.
      </Text>

      {/* Booking summary */}
      <View style={styles.card}>
        {/* Booking ID */}
        <View style={styles.row}>
          <Receipt
            size={18}
            color={colors.textMuted}
          />

          <View style={styles.rowContent}>
            <Text style={styles.label}>
              Booking ID
            </Text>

            <Text style={styles.value}>
              #{appointmentId}
            </Text>
          </View>
        </View>

        {/* Professional */}
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {professionalName
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.label}>
              Professional
            </Text>

            <Text style={styles.value}>
              {professionalName}
            </Text>

            {appointment.professional
              ?.profession ? (
              <Text style={styles.secondaryText}>
                {
                  appointment.professional
                    .profession
                }
              </Text>
            ) : null}
          </View>
        </View>

        {/* Service */}
        <View style={styles.row}>
          <Receipt
            size={18}
            color={colors.textMuted}
          />

          <View style={styles.rowContent}>
            <Text style={styles.label}>
              Service
            </Text>

            <Text style={styles.value}>
              {serviceName}
            </Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.row}>
          <Calendar
            size={18}
            color={colors.textMuted}
          />

          <View style={styles.rowContent}>
            <Text style={styles.label}>
              Date
            </Text>

            <Text style={styles.value}>
              {appointment.date}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Clock
            size={18}
            color={colors.textMuted}
          />

          <View style={styles.rowContent}>
            <Text style={styles.label}>
              Time
            </Text>

            <Text style={styles.value}>
              {appointment.startTime}
              {appointment.endTime
                ? ` - ${appointment.endTime}`
                : ''}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View
          style={[
            styles.row,
            styles.lastRow,
          ]}
        >
          <MapPin
            size={18}
            color={colors.textMuted}
          />

          <View style={styles.rowContent}>
            <Text style={styles.label}>
              Location
            </Text>

            <Text style={styles.value}>
              {location}
            </Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            Total
          </Text>

          <Text style={styles.price}>
            Rs {appointment.price}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="View Appointment"
          onPress={() =>
            navigation.navigate(
              'AppointmentDetail',
              {
                id: appointment._id,
              }
            )
          }
          style={styles.fullButton}
        />

        <Button
          title="Back to Home"
          variant="ghost"
          onPress={() =>
            navigation.navigate(
              'CustomerApp',
              {
                screen: 'Home',
              }
            )
          }
          style={styles.fullButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...typography.h1,
    marginTop: spacing.lg,
    textAlign: 'center',
  },

  subtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 320,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    marginTop: spacing.xl,
    ...shadows.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  lastRow: {
    marginBottom: 0,
  },

  rowContent: {
    flex: 1,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },

  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  secondaryText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '700',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },

  priceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },

  price: {
    ...typography.h3,
    color: colors.primaryDark,
  },

  actions: {
    width: '100%',
    marginTop: spacing.xl,
  },

  fullButton: {
    width: '100%',
    marginTop: spacing.sm,
  },

  errorTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});