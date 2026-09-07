
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Search as SearchIcon } from 'lucide-react-native';

import { colors, typography, spacing, radius } from '../../theme';
import { SORT_OPTIONS } from '../../constants';

import professionalService from '../../services/professionalService';
import categoryService from '../../services/categoryService';

import { useFavoritesStore } from '../../store/favoriteStore';

import ProfessionalCard from '../../components/cards/ProfessionalCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const NUM_COLUMNS = 2;
const COLUMN_GAP = spacing.md;
const H_PADDING = spacing.lg;

export default function DiscoverScreen({ navigation, route }) {
  const { width } = useWindowDimensions();

  const cardWidth =
    (width -
      H_PADDING * 2 -
      COLUMN_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(
    route.params?.category || null
  );
  const [sort, setSort] = useState('recommended');

  const [categories, setCategories] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    isFavorite,
    toggleFavorite,
    fetchFavorites,
  } = useFavoritesStore();

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);

      const result = await categoryService.list();

      setCategories(result || []);
    } catch (error) {
      console.error('Load categories error:', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadProfessionals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await professionalService.list({
        search: search.trim() || undefined,
        category: category || undefined,
        sort,
      });

      setProfessionals(result || []);
    } catch (error) {
      console.error('Load professionals error:', error);

      setError(
        error.message || 'Failed to load professionals'
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProfessionals();
    }, 300);

    return () => clearTimeout(timeout);
  }, [loadProfessionals]);

  const handleCategoryPress = (categoryId) => {
    setCategory((current) =>
      current === categoryId ? null : categoryId
    );
  };

 const renderProfessional = ({ item, index }) => (
  <View
    style={[
      styles.professionalWrapper,
      {
        width: cardWidth,
        marginRight:
          index % NUM_COLUMNS === 0 ? COLUMN_GAP : 0,
      },
    ]}
  >
    <ProfessionalCard
      professional={item}
      isFavorite={isFavorite(item._id)}
      onToggleFavorite={() => toggleFavorite(item._id)}
      onPress={() =>
        navigation.navigate('ProfessionalDetail', {
          id: item._id,
        })
      }
    />
  </View>
);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchIcon
            size={18}
            color={colors.textMuted}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search professionals..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </View>

      {!categoriesLoading && categories.length > 0 && (
        <View style={styles.filtersBlock}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
            renderItem={({ item }) => {
              const isActive = category === item._id;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    handleCategoryPress(item._id)
                  }
                  style={[
                    styles.chip,
                    isActive && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isActive && styles.chipTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      <View style={styles.filtersBlock}>
        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => {
            const isActive = sort === item.id;

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSort(item.id)}
                style={[
                  styles.sortChip,
                  isActive && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive && styles.chipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={loadProfessionals}
        />
      ) : professionals.length === 0 ? (
        <EmptyState
          title="No professionals found"
          subtitle="Try a different category or search term."
        />
      ) : (
        <FlatList
          data={professionals}
          keyExtractor={(item) => item._id}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderProfessional}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },

  searchRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    paddingHorizontal: spacing.md,
  },

  searchInput: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    paddingVertical: 0,
  },

  filtersBlock: {
    marginBottom: spacing.sm,
  },

  chipRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sortChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    ...typography.label,
    color: colors.textSecondary,
  },

  chipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  columnWrapper: {
    paddingHorizontal: H_PADDING,
    marginBottom: COLUMN_GAP,
  },

  professionalWrapper: {
    overflow: 'hidden',
  },

  resultsContent: {
    paddingBottom: spacing.xxl,
  },
});
