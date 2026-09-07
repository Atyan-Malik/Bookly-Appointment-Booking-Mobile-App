import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../theme';
import Button from '../../components/ui/Button';

const SLIDES = [
  { title: 'Find the right professional', subtitle: 'Browse trusted doctors, salons, trainers, and more near you.' },
  { title: 'Book appointments instantly', subtitle: 'See real-time availability and book in a few taps.' },
  { title: 'Manage everything in one place', subtitle: 'Track upcoming visits, favorites, and reminders.' },
];

export default function OnboardingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <LinearGradient colors={colors.gradients.heroSoft} style={styles.container}>
      <View style={styles.skipRow}>
        <Text style={styles.skip} onPress={() => navigation.replace('Login')}>Skip</Text>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.illustration} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <Button title={index === SLIDES.length - 1 ? 'Get Started' : 'Next'} onPress={goNext} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipRow: { alignItems: 'flex-end', paddingTop: 60, paddingHorizontal: spacing.xl },
  skip: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: radius.xxl,
    backgroundColor: colors.card,
    opacity: 0.7,
    marginBottom: spacing.xxl,
  },
  title: { ...typography.h1, textAlign: 'center' },
  subtitle: { ...typography.bodyLarge, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  footer: { padding: spacing.xl, paddingBottom: spacing.xxl },
});


