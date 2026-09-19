import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
  const { appointment } = route.params || {};

  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIcon}>
          <Receipt
            size={32}
            color={colors.primary}
          />
        </View>

        <Text style={styles.errorTitle}>
          Booking information unavailable
        </Text>

        <Text style={styles.errorText}>
          We couldn't load your appointment details.
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
    appointment.professional?.name ||
    'Professional';

  const serviceName =
    appointment.service?.name ||
    'Service';

  const location =
    appointment.professional?.location?.city ||
    appointment.professional?.location?.address ||
    'Location not provided';

  const professionalInitial = professionalName
    .charAt(0)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <CheckCircle2
                size={56}
                color={colors.success}
                strokeWidth={2.2}
              />
            </View>
          </View>

          <Text style={styles.title}>
            Appointment Confirmed!
          </Text>

          <Text style={styles.subtitle}>
            Your appointment has been successfully booked.
          </Text>
        </View>

        {/* Booking Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>
                Booking summary
              </Text>

              <Text style={styles.cardSubtitle}>
                Your appointment details
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                {appointment.status || 'PENDING'}
              </Text>
            </View>
          </View>

          {/* Booking ID */}
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Receipt
                size={18}
                color={colors.primary}
              />
            </View>

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
                {professionalInitial}
              </Text>
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.label}>
                Professional
              </Text>

              <Text
                style={styles.value}
                numberOfLines={1}
              >
                {professionalName}
              </Text>

              {appointment.professional?.profession ? (
                <Text
                  style={styles.secondaryText}
                  numberOfLines={1}
                >
                  {appointment.professional.profession}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Service */}
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Receipt
                size={18}
                color={colors.primary}
              />
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.label}>
                Service
              </Text>

              <Text
                style={styles.value}
                numberOfLines={2}
              >
                {serviceName}
              </Text>
            </View>
          </View>

          {/* Date */}
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Calendar
                size={18}
                color={colors.primary}
              />
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.label}>
                Date
              </Text>

              <Text style={styles.value}>
                {appointment.date}
              </Text>
            </View>
          </View>

          {/* Time */}
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Clock
                size={18}
                color={colors.primary}
              />
            </View>

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
          <View style={[styles.row, styles.lastRow]}>
            <View style={styles.iconContainer}>
              <MapPin
                size={18}
                color={colors.primary}
              />
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.label}>
                Location
              </Text>

              <Text
                style={styles.value}
                numberOfLines={2}
              >
                {location}
              </Text>
            </View>
          </View>

          {/* Total */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>
                Total amount
              </Text>

              <Text style={styles.priceCaption}>
                Payment due according to provider
              </Text>
            </View>

            <Text style={styles.price}>
              Rs {appointment.price ?? 0}
            </Text>
          </View>
        </View>

        {/* Helpful Message */}
        <View style={styles.infoCard}>
          <View style={styles.infoDot} />

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              What's next?
            </Text>

            <Text style={styles.infoText}>
              Your appointment request has been sent
              to the professional. You can view its
              status and details anytime from your
              appointments.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
         <Button
  title="View Appointment"
  onPress={() =>
    navigation.navigate('Appointments', {
      screen: 'AppointmentDetail',
      params: {
        id: appointment._id,
      },
    })
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
      </ScrollView>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  /* Success Header */

  successHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  successIconOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadows.sm,
  },

  successIconInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  title: {
    ...typography.h1,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.lg,
  },

  subtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.xs,
    maxWidth: 310,
  },

  /* Main Card */

  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    ...shadows.sm,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    marginBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  cardTitle: {
    ...typography.h3,
    fontWeight: '700',
  },

  cardSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.warning || colors.primary,
    marginRight: 5,
  },

  statusText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 11,
  },

  /* Rows */

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    marginRight: spacing.md,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    marginRight: spacing.md,
  },

  avatarText: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '700',
  },

  rowContent: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 3,
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

  /* Price */

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  priceLabel: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  priceCaption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    maxWidth: 190,
  },

  price: {
    ...typography.h3,
    color: colors.primaryDark,
    fontWeight: '800',
  },

  /* Info */

  infoCard: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    ...typography.label,
    fontWeight: '700',
    marginBottom: 4,
  },

  infoText: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },

  /* Actions */

  actions: {
    width: '100%',
    marginTop: spacing.lg,
  },

  fullButton: {
    width: '100%',
    marginTop: spacing.sm,
  },

  /* Error */

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  errorTitle: {
    ...typography.h3,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  errorText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});