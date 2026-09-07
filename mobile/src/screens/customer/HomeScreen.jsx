
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Bell,
  Search as SearchIcon,
  ChevronRight,
} from 'lucide-react-native';

import {
  colors,
  typography,
  spacing,
  radius,
} from '../../theme';

import { useAuthStore } from '../../store/authStore';
import { useFavoritesStore } from '../../store/favoriteStore';

import professionalService from '../../services/professionalService';
import categoryService from '../../services/categoryService';

import CategoryCard from '../../components/cards/CategoryCard';
import ProfessionalCard from '../../components/cards/ProfessionalCard';

import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);

  const {
    fetchFavorites,
    isFavorite,
    toggleFavorite,
  } = useFavoritesStore();

  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // LOAD PROFESSIONALS
  // ==========================================

  const loadProfessionals = useCallback(async () => {
    try {
      setError(null);

      const result = await professionalService.list({
        sort: 'recommended',
        limit: 10,
      });

      setProfessionals(result || []);
    } catch (e) {
      console.error(
        'Load recommended professionals error:',
        e
      );

      setError(
        e.message ||
          'Failed to load recommended professionals'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);

      const result = await categoryService.list();

      setCategories(result || []);
    } catch (e) {
      console.error(
        'Load categories error:',
        e
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProfessionals();
    loadCategories();
    fetchFavorites();
  }, [
    loadProfessionals,
    loadCategories,
    fetchFavorites,
  ]);

  // ==========================================
  // REFRESH
  // ==========================================

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        loadProfessionals(),
        loadCategories(),
        fetchFavorites(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================
  // CATEGORY PRESS
  // ==========================================

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Discover', {
      screen: 'DiscoverHome',
      params: {
        category: categoryId,
      },
    });
  };

  // ==========================================
  // USER
  // ==========================================

  const firstName =
    user?.name?.split(' ')[0] || 'there';

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <LoadingState />;
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Good morning, {firstName}!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('Notifications')
          }
          style={styles.notificationButton}
        >
          <Bell
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* ========================================
          SEARCH
      ======================================== */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.searchBar}
        onPress={() =>
          navigation.navigate('Discover')
        }
      >
        <SearchIcon
          size={18}
          color={colors.textMuted}
        />

        <Text style={styles.searchPlaceholder}>
          Search professionals, services...
        </Text>
      </TouchableOpacity>

      {/* ========================================
          HERO
      ======================================== */}

      <LinearGradient
        colors={colors.gradients.hero}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>
          Book your next appointment
        </Text>

        <Text style={styles.heroSubtitle}>
          Find trusted professionals near you.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.heroButton}
          onPress={() =>
            navigation.navigate('Discover')
          }
        >
          <Text style={styles.heroButtonText}>
            Find a Professional
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ========================================
          CATEGORIES
      ======================================== */}

      <View style={styles.categorySection}>
        {/* Category Header */}

        <View style={styles.categoryHeader}>
          <View style={styles.categoryHeaderText}>
            <Text style={styles.categoryTitle}>
              Categories
            </Text>

            <Text style={styles.categorySubtitle}>
              Explore services by category
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.seeAllButton}
            onPress={() =>
              navigation.navigate('Discover')
            }
          >
            <Text style={styles.seeAllText}>
              See all
            </Text>

            <ChevronRight
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Category Cards */}

        {categoriesLoading ? (
          <View style={styles.categoryLoading}>
            <View style={styles.categorySkeleton} />
            <View style={styles.categorySkeleton} />
            <View style={styles.categorySkeleton} />
          </View>
        ) : categories.length > 0 ? (
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={
              styles.categoryList
            }
            ItemSeparatorComponent={() => (
              <View style={styles.categoryGap} />
            )}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() =>
                  handleCategoryPress(item._id)
                }
              />
            )}
          />
        ) : (
          <View style={styles.categoryEmpty}>
            <Text style={styles.categoryEmptyText}>
              No categories available
            </Text>
          </View>
        )}
      </View>

      {/* ========================================
          RECOMMENDED
      ======================================== */}

      <View style={styles.recommendedSection}>
        <View style={styles.sectionRow}>
          <View>
            <Text style={styles.sectionTitle}>
              Recommended for you
            </Text>

            <Text style={styles.sectionSubtitle}>
              Professionals you may like
            </Text>
          </View>
        </View>

        {/* Error */}

        {error ? (
          <ErrorState
            message={error}
            onRetry={loadProfessionals}
          />
        ) : professionals.length === 0 ? (
          /* Empty */

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No professionals available
            </Text>

            <Text style={styles.emptySubtitle}>
              Check back soon for available
              professionals.
            </Text>
          </View>
        ) : (
          /* Professionals */

          <FlatList
            data={professionals}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={
              styles.professionalList
            }
            renderItem={({ item }) => (
              <ProfessionalCard
                professional={item}
                isFavorite={isFavorite(item._id)}
                onToggleFavorite={() =>
                  toggleFavorite(item._id)
                }
                onPress={() =>
                  navigation.navigate(
                    'Discover',
                    {
                      screen:
                        'ProfessionalDetail',
                      params: {
                        id: item._id,
                      },
                    }
                  )
                }
              />
            )}
          />
        )}
      </View>

      {/* Bottom spacing */}

      <View
        style={{
          height: spacing.xxl,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // SCREEN
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },

  greeting: {
    ...typography.h3,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================
  // SEARCH
  // ==========================================

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },

  // ==========================================
  // HERO
  // ==========================================

  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },

  heroTitle: {
    ...typography.h2,
    color: colors.white,
  },

  heroSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },

  heroButton: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  heroButtonText: {
    ...typography.button,
    color: colors.primary,
  },

  // ==========================================
  // CATEGORY SECTION
  // ==========================================

  categorySection: {
    marginBottom: spacing.xl,
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  categoryHeaderText: {
    flex: 1,
  },

  categoryTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  categorySubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 3,
  },

  // ==========================================
  // SEE ALL
  // ==========================================

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },

  seeAllText: {
    ...typography.button,
    color: colors.primary,
    fontSize: 13,
  },

  // ==========================================
  // CATEGORY LIST
  // ==========================================

  categoryList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },

  categoryGap: {
    width: spacing.sm,
  },

  // ==========================================
  // CATEGORY LOADING
  // ==========================================

  categoryLoading: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  categorySkeleton: {
    width: 90,
    height: 110,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ==========================================
  // CATEGORY EMPTY
  // ==========================================

  categoryEmpty: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  categoryEmptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // ==========================================
  // RECOMMENDED
  // ==========================================

  recommendedSection: {
    marginBottom: spacing.lg,
  },

  sectionRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  sectionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 3,
  },

  professionalList: {
    paddingHorizontal: spacing.lg,
  },

  // ==========================================
  // EMPTY PROFESSIONALS
  // ==========================================

  emptyContainer: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  emptySubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
