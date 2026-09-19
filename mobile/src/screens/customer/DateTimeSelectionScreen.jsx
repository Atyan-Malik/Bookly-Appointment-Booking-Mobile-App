// screens/customer/DateTimeSelectionScreen.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { format, addDays } from "date-fns";

import {
  colors,
  typography,
  spacing,
  radius,
} from "../../theme";

import professionalService from "../../services/professionalService";

import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";

const DAYS_AHEAD = 14;

function groupSlots(slots) {
  const groups = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  slots.forEach((slot) => {
    if (!slot?.time) {
      return;
    }

    const hour = Number(slot.time.split(":")[0]);

    if (hour < 12) {
      groups.Morning.push(slot);
    } else if (hour < 17) {
      groups.Afternoon.push(slot);
    } else {
      groups.Evening.push(slot);
    }
  });

  return groups;
}

export default function DateTimeSelectionScreen({
  route,
  navigation,
}) {
  const {
    professional,
    service,
  } = route.params || {};

  const professionalId = professional?._id;
  const durationMinutes = service?.durationMinutes;

  const dates = useMemo(
    () =>
      Array.from(
        { length: DAYS_AHEAD },
        (_, index) => addDays(new Date(), index)
      ),
    []
  );

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [error, setError] = useState(null);

  const loadAvailability = async ({
    refresh = false,
  } = {}) => {
    if (!professionalId || !durationMinutes) {
      setLoading(false);
      setRefreshing(false);
      setError("Professional or service information is missing.");
      return;
    }

    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      setSelectedTime(null);

      const dateStr = format(
        selectedDate,
        "yyyy-MM-dd"
      );

      console.log(
        "📅 Loading availability:",
        {
          professionalId,
          date: dateStr,
          duration: durationMinutes,
        }
      );

      const data =
        await professionalService.getAvailability(
          professionalId,
          dateStr,
          durationMinutes
        );

      console.log(
        "📅 Availability response:",
        data
      );

      setSlots(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "❌ Availability error:",
        err?.response?.data || err
      );

      setSlots([]);

      setError(
        err?.response?.data?.message ||
          "Unable to load availability. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [
    selectedDate,
    professionalId,
    durationMinutes,
  ]);

  const grouped = groupSlots(slots);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (!selectedTime) {
      return;
    }

    const date = format(
      selectedDate,
      "yyyy-MM-dd"
    );

    console.log(
      "➡️ Continue to booking:",
      {
        professional,
        service,
        date,
        startTime: selectedTime,
      }
    );

    navigation.navigate("Booking", {
      professional,
      service,
      date,
      startTime: selectedTime,
    });
  };

  /*
   * Missing navigation data protection
   */
  if (!professional || !service) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Booking information is missing
        </Text>

        <Text style={styles.errorText}>
          Please go back and select the professional
          and service again.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Pick a date & time
        </Text>

        <Text style={styles.subtitle}>
          {service.name} with{" "}
          {professional?.user?.name ||
            "Professional"}
        </Text>

        <Text style={styles.serviceMeta}>
          Rs {service.price} ·{" "}
          {service.durationMinutes} minutes
        </Text>
      </View>

      {/* Date selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateRow}
        contentContainerStyle={styles.dateRowContent}
      >
        {dates.map((date) => {
          const active =
            format(
              date,
              "yyyy-MM-dd"
            ) ===
            format(
              selectedDate,
              "yyyy-MM-dd"
            );

          return (
            <TouchableOpacity
              key={date.toISOString()}
              onPress={() =>
                handleDateSelect(date)
              }
              style={[
                styles.dateChip,
                active &&
                  styles.dateChipActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dateDay,
                  active &&
                    styles.dateTextActive,
                ]}
              >
                {format(date, "EEE")}
              </Text>

              <Text
                style={[
                  styles.dateNum,
                  active &&
                    styles.dateTextActive,
                ]}
              >
                {format(date, "d")}
              </Text>

              <Text
                style={[
                  styles.dateMonth,
                  active &&
                    styles.dateTextActive,
                ]}
              >
                {format(date, "MMM")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Availability */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ScrollView
          contentContainerStyle={
            styles.emptyContent
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadAvailability({
                  refresh: true,
                })
              }
            />
          }
        >
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Couldn't load availability
            </Text>

            <Text style={styles.emptyText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() =>
                loadAvailability()
              }
              activeOpacity={0.8}
            >
              <Text
                style={styles.retryButtonText}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.slotsScroll}
          contentContainerStyle={[
            styles.slotsContent,
            slots.length === 0 &&
              styles.emptyContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadAvailability({
                  refresh: true,
                })
              }
            />
          }
        >
          {Object.entries(grouped).map(
            ([label, group]) => {
              if (group.length === 0) {
                return null;
              }

              return (
                <View
                  key={label}
                  style={styles.group}
                >
                  <Text
                    style={
                      styles.groupLabel
                    }
                  >
                    {label}
                  </Text>

                  <View
                    style={
                      styles.slotGrid
                    }
                  >
                    {group.map((slot) => {
                      const isAvailable =
                        slot.available !==
                        false;

                      const isSelected =
                        selectedTime ===
                        slot.time;

                      return (
                        <TouchableOpacity
                          key={slot.time}
                          disabled={
                            !isAvailable
                          }
                          onPress={() =>
                            handleTimeSelect(
                              slot.time
                            )
                          }
                          style={[
                            styles.slot,
                            !isAvailable &&
                              styles.slotDisabled,
                            isSelected &&
                              styles.slotSelected,
                          ]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              !isAvailable &&
                                styles.slotTextDisabled,
                              isSelected &&
                                styles.slotTextSelected,
                            ]}
                          >
                            {slot.time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            }
          )}

          {slots.length === 0 && (
            <View
              style={
                styles.emptyContainer
              }
            >
              <Text
                style={
                  styles.emptyTitle
                }
              >
                No availability on this date
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                This professional isn't available
                on the selected date. Try another
                day.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Continue */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          disabled={!selectedTime}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },

  title: {
    ...typography.h2,
    marginBottom: 4,
  },

  subtitle: {
    ...typography.bodySecondary,
  },

  serviceMeta: {
    ...typography.caption,
    marginTop: 4,
    color: colors.primary,
  },

  dateRow: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },

  dateRowContent: {
    paddingHorizontal: spacing.lg,
  },

  dateChip: {
    width: 62,
    height: 78,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  dateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  dateDay: {
    ...typography.caption,
  },

  dateNum: {
    ...typography.h4,
    marginTop: 2,
  },

  dateMonth: {
    ...typography.caption,
    marginTop: 2,
  },

  dateTextActive: {
    color: colors.white,
  },

  slotsScroll: {
    flex: 1,
  },

  slotsContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },

  group: {
    marginBottom: spacing.lg,
  },

  groupLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    fontWeight: "700",
  },

  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  slot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },

  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  slotDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    opacity: 0.4,
  },

  slotText: {
    ...typography.label,
    color: colors.textPrimary,
  },

  slotTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },

  slotTextDisabled: {
    color: colors.textMuted,
    textDecorationLine:
      "line-through",
  },

  emptyContent: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },

  emptyTitle: {
    ...typography.h4,
    textAlign: "center",
  },

  emptyText: {
    ...typography.bodySecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },

  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },

  retryButtonText: {
    color: colors.white,
    fontWeight: "700",
  },

  errorTitle: {
    ...typography.h4,
    textAlign: "center",
  },

  errorText: {
    ...typography.bodySecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  backButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },

  backButtonText: {
    color: colors.white,
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});