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
  Sparkles,
} from 'lucide-react-native';

import {
  colors,
  typography,
  spacing,
  radius,
} from '../../theme';

import { useAuthStore } from '../../store/authStore';
import { useFavoritesStore } from '../../store/favoriteStore';
import { useNotificationStore } from '../../store/notificationStore';

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

  const {
  notifications,
  fetchNotifications,
} = useNotificationStore();


  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // NOTIFICATION BADGE
  // ==========================================
const unreadCount = (notifications || []).filter(
  (notification) => !notification.isRead
).length;
 

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
    fetchNotifications();
  }, [
    loadProfessionals,
    loadCategories,
    fetchFavorites,
    fetchNotifications,
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
        fetchNotifications(),
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
  // PROFESSIONAL PRESS
  // ==========================================

  const handleProfessionalPress = (professionalId) => {
    navigation.navigate('Discover', {
      screen: 'ProfessionalDetail',
      params: {
        id: professionalId,
      },
    });
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

 const handleNotificationsPress = () => {
  navigation.getParent()?.navigate('Notifications');
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
      contentContainerStyle={styles.contentContainer}
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
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>
            Welcome back
          </Text>

          <Text
            style={styles.greeting}
            numberOfLines={1}
          >
            Good morning, {firstName}!
          </Text>
        </View>

       <TouchableOpacity
  activeOpacity={0.75}
  onPress={handleNotificationsPress}
  style={styles.notificationButton}
>
  <Bell
    size={21}
    color={colors.textPrimary}
  />

  {unreadCount > 0 && (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationBadgeText}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </View>
  )}
</TouchableOpacity>
      </View>

      {/* ========================================
          SEARCH
      ======================================== */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.searchBar}
        onPress={() =>
          navigation.navigate('Discover')
        }
      >
        <View style={styles.searchIconContainer}>
          <SearchIcon
            size={18}
            color={colors.primary}
          />
        </View>

        <Text
          style={styles.searchPlaceholder}
          numberOfLines={1}
        >
          Search professionals or services
        </Text>

        <ChevronRight
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* ========================================
          HERO
      ======================================== */}

      <LinearGradient
        colors={colors.gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <Sparkles
            size={13}
            color={colors.white}
          />

          <Text style={styles.heroBadgeText}>
            Easy & trusted booking
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          Book your next appointment
        </Text>

        <Text style={styles.heroSubtitle}>
          Find trusted professionals near you and
          book your appointment in minutes.
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

          <ChevronRight
            size={17}
            color={colors.primary}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* ========================================
          CATEGORIES
      ======================================== */}

      <View style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>
              Explore categories
            </Text>

            <Text style={styles.sectionSubtitle}>
              Find the right service for you
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
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <View style={styles.recommendedTitleRow}>
              <View style={styles.sparkleContainer}>
                <Sparkles
                  size={14}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.sectionTitle}>
                Recommended for you
              </Text>
            </View>

            <Text style={styles.sectionSubtitle}>
              Professionals you may like
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

        {error ? (
          <View style={styles.errorWrapper}>
            <ErrorState
              message={error}
              onRetry={loadProfessionals}
            />
          </View>
        ) : professionals.length === 0 ? (
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
          <FlatList
            data={professionals}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={
              styles.professionalList
            }
            ItemSeparatorComponent={() => (
              <View style={styles.professionalGap} />
            )}
            renderItem={({ item }) => (
              <View
                style={styles.professionalCardWrapper}
              >
                <ProfessionalCard
                  professional={item}
                  isFavorite={isFavorite(item._id)}
                  onToggleFavorite={() =>
                    toggleFavorite(item._id)
                  }
                  onPress={() =>
                    handleProfessionalPress(
                      item._id
                    )
                  }
                />
              </View>
            )}
          />
        )}
      </View>

      {/* ========================================
          BOTTOM SPACING
      ======================================== */}

      <View style={styles.bottomSpacing} />
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

  contentContainer: {
    paddingBottom: spacing.xxl,
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 58,
    paddingBottom: spacing.md,
  },

  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },

  welcomeText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },

  greeting: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },

  notificationBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },

  // ==========================================
  // SEARCH
  // ==========================================

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchIconContainer: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}12`,
    marginRight: spacing.sm,
  },

  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },

  // ==========================================
  // HERO
  // ==========================================

  hero: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 200,
    overflow: 'hidden',
  },

  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    marginBottom: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  heroBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 11,
  },

  heroTitle: {
    ...typography.h2,
    color: colors.white,
    lineHeight: 30,
    maxWidth: '90%',
  },

  heroSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    lineHeight: 20,
    maxWidth: '95%',
  },

  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },

  heroButtonText: {
    ...typography.button,
    color: colors.primary,
  },

  // ==========================================
  // SECTION HEADER
  // ==========================================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  sectionHeaderText: {
    flex: 1,
    paddingRight: spacing.sm,
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
  // CATEGORIES
  // ==========================================

  categorySection: {
    marginBottom: spacing.xl,
  },

  categoryList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },

  categoryGap: {
    width: 8,
  },

  categoryLoading: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 8,
  },

  categorySkeleton: {
    width: 86,
    height: 104,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

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

  recommendedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sparkleContainer: {
    width: 27,
    height: 27,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}12`,
    marginRight: spacing.xs,
  },

  /*
   * Important:
   * Each card now has its own fixed width.
   * This prevents ProfessionalCard's width: '100%'
   * from expanding across the horizontal list.
   */

  professionalList: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
  },

  professionalCardWrapper: {
    width: 210,
  },

  professionalGap: {
    width: 10,
  },

  // ==========================================
  // ERROR
  // ==========================================

  errorWrapper: {
    marginHorizontal: spacing.lg,
  },

  // ==========================================
  // EMPTY
  // ==========================================

  emptyContainer: {
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
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
    lineHeight: 20,
  },

  // ==========================================
  // BOTTOM
  // ==========================================

  bottomSpacing: {
    height: spacing.xxl,
  },
});