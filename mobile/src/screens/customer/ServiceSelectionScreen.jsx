import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react-native";

import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from "../../theme";

import professionalService from "../../services/professionalService";

export default function ServiceSelectionScreen({
  route,
  navigation,
}) {
  const {
    professional,
    selectedService,
  } = route.params || {};

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const professionalId = professional?._id;

  useEffect(() => {
    if (!professionalId) {
      setLoading(false);
      setError("Professional information is missing.");
      return;
    }

    loadServices();
  }, [professionalId]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await professionalService.getServices(
        professionalId
      );

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load professional services:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load services. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    navigation.navigate("DateTimeSelection", {
      professional,
      service,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading services...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIcon}>
          <AlertCircle
            size={28}
            color={colors.primary}
          />
        </View>

        <Text style={styles.errorTitle}>
          Couldn't load services
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadServices}
          activeOpacity={0.8}
        >
          <RefreshCw
            size={17}
            color={colors.card}
          />

          <Text style={styles.retryText}>
            Try again
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
          Select a service
        </Text>

        <Text style={styles.subtitle}>
          with {professional?.user?.name || "Professional"}
        </Text>
      </View>

      {/* Services */}
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContent,
          services.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadServices}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No services available
            </Text>

            <Text style={styles.emptyText}>
              This professional hasn't added any services yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected =
            selectedService?._id === item._id;

          return (
            <TouchableOpacity
              style={[
                styles.card,
                isSelected && styles.selectedCard,
              ]}
              activeOpacity={0.8}
              onPress={() => handleServiceSelect(item)}
            >
              {/* Service information */}
              <View style={styles.serviceInfo}>
                <Text style={styles.name}>
                  {item.name}
                </Text>

                {item.description ? (
                  <Text
                    style={styles.description}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                ) : null}

                <View style={styles.metaRow}>
                  <Clock
                    size={13}
                    color={colors.textMuted}
                  />

                  <Text style={styles.meta}>
                    {item.durationMinutes} minutes
                  </Text>
                </View>
              </View>

              {/* Price + arrow */}
              <View style={styles.right}>
                <Text style={styles.price}>
                  Rs {item.price}
                </Text>

                <ChevronRight
                  size={20}
                  color={colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
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

  loadingText: {
    ...typography.bodySecondary,
    marginTop: spacing.md,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },

  title: {
    ...typography.h2,
  },

  subtitle: {
    ...typography.bodySecondary,
    marginTop: 2,
  },

  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 40,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },

  selectedCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  serviceInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  name: {
    ...typography.h4,
  },

  description: {
    ...typography.bodySecondary,
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },

  meta: {
    ...typography.caption,
  },

  right: {
    alignItems: "flex-end",
    gap: 4,
  },

  price: {
    ...typography.h4,
    color: colors.primaryDark,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    flex: 1,
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

  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  errorTitle: {
    ...typography.h4,
    textAlign: "center",
  },

  errorText: {
    ...typography.bodySecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },

  retryText: {
    color: colors.card,
    fontWeight: "700",
  },
});