import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Star,
  MapPin,
  BadgeCheck,
  Clock,
} from 'lucide-react-native';

import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from '../../theme';

import professionalService from '../../services/professionalService';
import { useFavoritesStore } from '../../store/favoriteStore';

import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';

export default function ProfessionalDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isFavorite, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    const loadProfessionalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [professionalData, servicesData, reviewsData] =
          await Promise.all([
            professionalService.getById(id),
            professionalService.getServices(id),
            professionalService.getReviews(id),
          ]);

        setProfessional(professionalData);
        setServices(servicesData || []);
        setReviews(reviewsData || []);
      } catch (e) {
        console.error('Professional detail error:', e);

        setError(
          e?.response?.data?.message ||
            e?.message ||
            'Failed to load profile'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfessionalData();
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !professional) {
    return (
      <ErrorState
        message={error || 'Professional not found'}
      />
    );
  }

  const name = professional.user?.name || 'Professional';

  const rating =
    typeof professional.rating === 'number'
      ? professional.rating.toFixed(1)
      : '0.0';

  const reviewCount = professional.reviewCount || 0;

  const favorite = isFavorite(professional._id);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =========================
            HERO
        ========================= */}
        <View style={styles.hero}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>

            {professional.isVerified && (
              <BadgeCheck
                size={18}
                color={colors.info}
              />
            )}
          </View>

          <Text style={styles.profession}>
            {professional.profession || 'Professional'}
          </Text>

          {/* Rating */}
          <View style={styles.statRow}>
            <Star
              size={15}
              color={colors.warning}
              fill={colors.warning}
            />

            <Text style={styles.statText}>
              {rating} ({reviewCount} reviews)
            </Text>
          </View>

          {/* Location / Experience */}
          <View style={styles.statRow}>
            <MapPin
              size={15}
              color={colors.textMuted}
            />

            <Text style={styles.statText}>
              {professional.location?.city || 'Location not specified'}
              {' • '}
              {professional.experienceYears || 0} yrs experience
            </Text>
          </View>
        </View>

        {/* =========================
            ABOUT
        ========================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About
          </Text>

          <Text style={styles.bio}>
            {professional.bio || 'No bio provided yet.'}
          </Text>
        </View>

        {/* =========================
            SERVICES
        ========================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Services
          </Text>

          {services.length === 0 ? (
            <Text style={styles.emptyText}>
              No services available yet.
            </Text>
          ) : (
            services.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(
                    'ServiceSelection',
                    {
                      professional,
                      service,
                    }
                  )
                }
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>
                    {service.name}
                  </Text>

                  <View style={styles.serviceMeta}>
                    <Clock
                      size={13}
                      color={colors.textMuted}
                    />

                    <Text style={styles.serviceMetaText}>
                      {service.durationMinutes} min
                    </Text>
                  </View>

                  {service.description ? (
                    <Text
                      style={styles.serviceDescription}
                      numberOfLines={2}
                    >
                      {service.description}
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.servicePrice}>
                  Rs {service.price}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* =========================
            REVIEWS
        ========================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Reviews
          </Text>

          {reviews.length === 0 ? (
            <Text style={styles.emptyReviews}>
              No reviews yet.
            </Text>
          ) : (
            reviews.slice(0, 5).map((review) => (
              <View
                key={review._id}
                style={styles.reviewCard}
              >
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>
                    {review.customer?.name || 'Customer'}
                  </Text>

                  <View style={styles.reviewRating}>
                    <Star
                      size={12}
                      color={colors.warning}
                      fill={colors.warning}
                    />

                    <Text style={styles.reviewRatingText}>
                      {review.rating}
                    </Text>
                  </View>
                </View>

                {review.comment ? (
                  <Text style={styles.reviewComment}>
                    {review.comment}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* =========================
          STICKY BOOKING BAR
      ========================= */}
      <View style={styles.stickyBar}>
        <TouchableOpacity
          onPress={() =>
            toggleFavorite(professional._id)
          }
          style={styles.favBtn}
          activeOpacity={0.8}
        >
          <Star
            size={22}
            color={
              favorite
                ? colors.primary
                : colors.textMuted
            }
            fill={
              favorite
                ? colors.primary
                : 'transparent'
            }
          />
        </TouchableOpacity>

        <Button
          title="Book Appointment"
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate(
              'ServiceSelection',
              {
                professional,
              }
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },

  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  avatarInitial: {
    ...typography.h1,
    color: colors.secondaryDark,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },

  name: {
    ...typography.h2,
  },

  profession: {
    ...typography.bodySecondary,
    marginTop: 2,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },

  statText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },

  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },

  bio: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },

  serviceInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  serviceName: {
    ...typography.h4,
    fontSize: 15,
  },

  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  serviceMetaText: {
    ...typography.caption,
  },

  serviceDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 5,
  },

  servicePrice: {
    ...typography.h4,
    color: colors.primaryDark,
  },

  emptyText: {
    ...typography.bodySecondary,
    color: colors.textMuted,
  },

  emptyReviews: {
    ...typography.bodySecondary,
  },

  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  reviewName: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  reviewRatingText: {
    ...typography.caption,
    fontWeight: '700',
  },

  reviewComment: {
    ...typography.bodySecondary,
    marginTop: 4,
  },

  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  favBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bookButton: {
    flex: 1,
  },
});