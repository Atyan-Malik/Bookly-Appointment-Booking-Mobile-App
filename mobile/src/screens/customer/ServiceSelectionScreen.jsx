import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  Clock,
  ChevronRight,
} from 'lucide-react-native';

import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from '../../theme';

export default function ServiceSelectionScreen({
  route,
  navigation,
}) {
  const {
    professional,
    services = [],
    selectedService,
  } = route.params;

  const handleServiceSelect = (service) => {
    navigation.navigate('DateTimeSelection', {
      professional,
      service,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Select a service
        </Text>

        <Text style={styles.subtitle}>
          with {professional?.user?.name || 'Professional'}
        </Text>
      </View>

      {/* Services */}
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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

  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },

  meta: {
    ...typography.caption,
  },

  right: {
    alignItems: 'flex-end',
    gap: 4,
  },

  price: {
    ...typography.h4,
    color: colors.primaryDark,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  emptyTitle: {
    ...typography.h4,
    textAlign: 'center',
  },

  emptyText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});