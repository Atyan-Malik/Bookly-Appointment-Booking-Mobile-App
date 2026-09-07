import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Heart } from 'lucide-react-native';

import { colors, typography, spacing } from '../../theme';
import { useFavoritesStore } from '../../store/favoriteStore';
import ProfessionalCard from '../../components/cards/ProfessionalCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export default function FavoritesScreen({ navigation }) {
  const {
    favorites,
    fetchFavorites,
    isFavorite,
    toggleFavorite,
  } = useFavoritesStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadFavorites = useCallback(async () => {
    try {
      setError(null);
      await fetchFavorites();
    } catch (err) {
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleToggleFavorite = async (professionalId) => {
    try {
      await toggleFavorite(professionalId);
    } catch (err) {
      console.log('Favorite error:', err);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState message={error} onRetry={loadFavorites} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites?.length || 0} saved professional
            {favorites?.length === 1 ? '' : 's'}
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Heart
            size={22}
            color={colors.primary}
            fill={colors.primary}
          />
        </View>
      </View>

      {/* Empty State */}
      {!favorites || favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Heart
              size={40}
              color={colors.primary}
              strokeWidth={1.5}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No favorites yet
          </Text>

          <Text style={styles.emptyText}>
            Save your favorite professionals here so you can
            easily find and book them later.
          </Text>

          <TouchableOpacity
            style={styles.discoverButton}
            onPress={() => navigation.navigate('Discover')}
          >
            <Text style={styles.discoverButtonText}>
              Discover Professionals
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) =>
            item._id ||
            item.professional?._id ||
            item.professional
          }
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => {
            /*
             * Your API may return either:
             *
             * favorite.professional
             *
             * or directly the professional object.
             */
            const professional =
              item.professional?._id
                ? item.professional
                : item;

            return (
              <View style={styles.cardWrapper}>
                <ProfessionalCard
                  professional={professional}
                  isFavorite={isFavorite(professional._id)}
                  onToggleFavorite={() =>
                    handleToggleFavorite(professional._id)
                  }
                  onPress={() =>
                    navigation.navigate('ProfessionalDetail', {
                      id: professional._id,
                    })
                  }
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    ...typography.h2,
  },

  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 3,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  cardWrapper: {
    width: '48%',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: -60,
  },

  emptyIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  emptyTitle: {
    ...typography.h3,
    textAlign: 'center',
  },

  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },

  discoverButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },

  discoverButtonText: {
    ...typography.button,
    color: colors.white,
  },
});