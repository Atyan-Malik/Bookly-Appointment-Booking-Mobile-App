import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Calendar,
  Clock,
  Phone,
  User,
  Briefcase,
  DollarSign,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { colors, typography, spacing, radius, shadows } from '../../theme';
import appointmentService from '../../services/appointmentService';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';

const STATUS_TONE = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'info',
  CANCELLED: 'error',
  NO_SHOW: 'neutral',
};

export default function ProviderAppointmentDetailScreen({ route, navigation }) {
  /*
   * IMPORTANT:
   * The previous error happened because route.params could be undefined.
   *
   * We now safely get the appointment ID.
   */
  const appointmentId = route?.params?.id;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --------------------------------------------------
  // LOAD APPOINTMENT
  // --------------------------------------------------

  const loadAppointment = async () => {
    if (!appointmentId) {
      setLoading(false);

      Toast.show({
        type: 'error',
        text1: 'Appointment not found',
        text2: 'Missing appointment ID.',
      });

      return;
    }

    try {
      setLoading(true);

      const data = await appointmentService.getById(appointmentId);

      setAppointment(data);
    } catch (error) {
      console.error(
        'Provider appointment detail error:',
        error?.response?.data || error
      );

      Toast.show({
        type: 'error',
        text1: 'Could not load appointment',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  // --------------------------------------------------
  // UPDATE STATUS
  // --------------------------------------------------

  const setStatus = async (status) => {
    if (!appointmentId) {
      Toast.show({
        type: 'error',
        text1: 'Appointment ID missing',
      });

      return;
    }

    setUpdating(true);

    try {
      const updated = await appointmentService.updateStatus(
        appointmentId,
        status
      );

      setAppointment(updated);

      Toast.show({
        type: 'success',
        text1: `Marked as ${status.toLowerCase().replace('_', '-')}`,
      });
    } catch (error) {
      console.error(
        'Update appointment status error:',
        error?.response?.data || error
      );

      Toast.show({
        type: 'error',
        text1: 'Could not update',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong.',
      });
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return <LoadingState />;
  }

  // --------------------------------------------------
  // MISSING APPOINTMENT
  // --------------------------------------------------

  if (!appointment) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          Appointment not found
        </Text>

        <Text style={styles.emptyText}>
          We could not load this appointment.
        </Text>

        <Button
          title="Go Back"
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const customer = appointment.customer;
  const service = appointment.service;

  const statusTone =
    STATUS_TONE[appointment.status] || 'neutral';

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* -------------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------------- */}

        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            <View style={styles.avatar}>
              <User
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.headerText}>
              <Text
                style={styles.title}
                numberOfLines={1}
              >
                {customer?.name || 'Customer'}
              </Text>

              <Text style={styles.subtitle}>
                Appointment Details
              </Text>
            </View>
          </View>

          <Badge
            label={appointment.status}
            tone={statusTone}
          />
        </View>

        {/* -------------------------------------------- */}
        {/* APPOINTMENT INFO */}
        {/* -------------------------------------------- */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Appointment
          </Text>

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

              <Text style={styles.rowText}>
                {appointment.date || 'Not available'}
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

              <Text style={styles.rowText}>
                {appointment.startTime || '--:--'}
                {' - '}
                {appointment.endTime || '--:--'}
              </Text>
            </View>
          </View>

          {/* Phone */}
          {customer?.phone && (
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Phone
                  size={18}
                  color={colors.primary}
                />
              </View>

              <View style={styles.rowContent}>
                <Text style={styles.label}>
                  Phone
                </Text>

                <Text style={styles.rowText}>
                  {customer.phone}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* -------------------------------------------- */}
        {/* CUSTOMER */}
        {/* -------------------------------------------- */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Customer
          </Text>

          <View style={styles.customerRow}>
            <View style={styles.customerAvatar}>
              <User
                size={22}
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={styles.customerName}>
                {customer?.name || 'Customer'}
              </Text>

              {customer?.email && (
                <Text style={styles.customerEmail}>
                  {customer.email}
                </Text>
              )}

              {customer?.phone && (
                <Text style={styles.customerPhone}>
                  {customer.phone}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* -------------------------------------------- */}
        {/* SERVICE */}
        {/* -------------------------------------------- */}

        <View style={styles.card}>
          <View style={styles.serviceHeader}>
            <Text style={styles.sectionTitle}>
              Service
            </Text>

            <Briefcase
              size={18}
              color={colors.textMuted}
            />
          </View>

          <Text style={styles.serviceName}>
            {service?.name || 'Service'}
          </Text>

          {service?.description && (
            <Text style={styles.description}>
              {service.description}
            </Text>
          )}

          <View style={styles.serviceDetails}>
            {/* Duration */}
            {service?.durationMinutes && (
              <View style={styles.detailItem}>
                <Clock
                  size={16}
                  color={colors.textMuted}
                />

                <Text style={styles.detailText}>
                  {service.durationMinutes} min
                </Text>
              </View>
            )}

            {/* Price */}
            <View style={styles.detailItem}>
              <DollarSign
                size={16}
                color={colors.textMuted}
              />

              <Text style={styles.detailText}>
                Rs {appointment.price ?? service?.price ?? 0}
              </Text>
            </View>
          </View>
        </View>

        {/* -------------------------------------------- */}
        {/* PRICE */}
        {/* -------------------------------------------- */}

        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceLabel}>
              Total Amount
            </Text>

            <Text style={styles.priceSubtext}>
              Appointment service
            </Text>
          </View>

          <Text style={styles.totalPrice}>
            Rs {appointment.price ?? 0}
          </Text>
        </View>

        {/* -------------------------------------------- */}
        {/* NOTES */}
        {/* -------------------------------------------- */}

        {appointment.notes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Notes
            </Text>

            <Text style={styles.notes}>
              {appointment.notes}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ============================================== */}
      {/* ACTIONS */}
      {/* ============================================== */}

      {/* PENDING */}
      {appointment.status === 'PENDING' && (
        <View style={styles.footer}>
          <Button
            title="Confirm"
            onPress={() => setStatus('CONFIRMED')}
            loading={updating}
            style={styles.actionButton}
          />

          <Button
            title="Decline"
            variant="outline"
            onPress={() => setStatus('CANCELLED')}
            loading={updating}
            style={styles.actionButton}
          />
        </View>
      )}

      {/* CONFIRMED */}
      {appointment.status === 'CONFIRMED' && (
        <View style={styles.footer}>
          <Button
            title="Mark Completed"
            onPress={() => setStatus('COMPLETED')}
            loading={updating}
            style={styles.actionButton}
          />

          <Button
            title="No-show"
            variant="outline"
            onPress={() => setStatus('NO_SHOW')}
            loading={updating}
            style={styles.actionButton}
          />
        </View>
      )}
    </View>
  );
}

// ======================================================
// STYLES
// ======================================================

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

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  headerText: {
    flex: 1,
  },

  title: {
    ...typography.h2,
  },

  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // --------------------------------------------------
  // CARD
  // --------------------------------------------------

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

  // --------------------------------------------------
  // ROW
  // --------------------------------------------------

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  rowContent: {
    flex: 1,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },

  rowText: {
    ...typography.body,
  },

  // --------------------------------------------------
  // CUSTOMER
  // --------------------------------------------------

  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  customerName: {
    ...typography.h4,
  },

  customerEmail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  customerPhone: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // --------------------------------------------------
  // SERVICE
  // --------------------------------------------------

  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  serviceName: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },

  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 21,
    marginTop: spacing.xs,
  },

  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  detailText: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  priceCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },

  priceLabel: {
    ...typography.h4,
  },

  priceSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  totalPrice: {
    ...typography.h2,
    color: colors.primaryDark,
  },

  // --------------------------------------------------
  // NOTES
  // --------------------------------------------------

  notes: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionButton: {
    flex: 1,
  },

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------

  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  emptyTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  backButton: {
    minWidth: 140,
  },
});