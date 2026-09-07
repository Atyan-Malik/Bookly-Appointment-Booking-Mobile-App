import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { Star, MapPin, Heart } from 'lucide-react-native';
import { colors, radius, spacing, typography, shadows } from '../../theme';

export default function ProfessionalCard({
  professional,
  onPress,
  isFavorite,
  onToggleFavorite,
}) {
  const name = professional.user?.name || professional.profession || 'Professional';

  // Get professional image directly from the Professional document
  const image = professional.images?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.initials}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.favButton}
          onPress={onToggleFavorite}
          hitSlop={8}
        >
          <Heart
            size={16}
            color={isFavorite ? colors.primary : colors.textMuted}
            fill={isFavorite ? colors.primary : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.profession} numberOfLines={1}>
          {professional.profession}
        </Text>

        <View style={styles.row}>
          <Star
            size={13}
            color={colors.warning}
            fill={colors.warning}
          />

          <Text style={styles.rating}>
            {professional.rating?.toFixed(1) ?? '0.0'}
          </Text>

          <Text style={styles.reviewCount}>
            ({professional.reviewCount ?? 0})
          </Text>
        </View>

        <View style={styles.row}>
          <MapPin size={13} color={colors.textMuted} />

          <Text style={styles.location} numberOfLines={1}>
            {professional.location?.city || 'Location unavailable'}
          </Text>
        </View>

        <Text style={styles.price}>
          From Rs {professional.startingPrice ?? 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
 card: {
  width: '100%',
  backgroundColor: colors.card,
  borderRadius: radius.lg,
  overflow: 'hidden',
  ...shadows.card,
},

  imageWrap: {
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },

  imagePlaceholder: {
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  initials: {
    ...typography.h2,
    color: colors.secondaryDark,
  },

  favButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    padding: 6,
  },

  info: {
    padding: spacing.sm,
  },

  name: {
    ...typography.h4,
    fontSize: 14,
  },

  profession: {
    ...typography.caption,
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  rating: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  reviewCount: {
    ...typography.caption,
  },

  location: {
    ...typography.caption,
    flex: 1,
  },

  price: {
    ...typography.label,
    color: colors.primaryDark,
    marginTop: spacing.xxs,
    fontWeight: '700',
  },
});