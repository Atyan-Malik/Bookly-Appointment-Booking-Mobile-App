import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require('../../assets/images/bookly-splash-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,248,250,0.05)',
            'rgba(255,248,250,0.72)',
            '#FFF7F9',
          ]}
          locations={[0, 0.38, 0.62, 0.84]}
          style={styles.gradient}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Top Badge */}
            <View style={styles.topBadge}>
              <Text style={styles.topBadgeText}>
                Simple. Trusted. Booked.
              </Text>
            </View>

            {/* Bottom Content */}
            <View style={styles.bottomContent}>
              {/* Heading */}
              <Text style={styles.title}>
                Book what you need,{'\n'}
                <Text style={styles.titleAccent}>
                  when you need it.
                </Text>
              </Text>

              {/* Description */}
              <Text style={styles.description}>
                Discover services from trusted professionals
                {'\n'}
                and book appointments in just a few taps.
              </Text>

              {/* Get Started */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.button}
                onPress={() => navigation.navigate('Auth')}
              >
                <Text style={styles.buttonText}>Get Started</Text>

                <View style={styles.arrowContainer}>
                  <ArrowRight
                    size={20}
                    color="#EC4899"
                    strokeWidth={2.6}
                  />
                </View>
              </TouchableOpacity>

              {/* Pagination */}
              <View style={styles.dots}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F9',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 18,
  },

  // TOP BADGE

  topBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.12)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  topBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.2,
  },

  // BOTTOM CONTENT

  bottomContent: {
    alignItems: 'center',
    paddingBottom: 12,
  },

  // TITLE

  title: {
    textAlign: 'center',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#111827',
  },

  titleAccent: {
    color: '#EC4899',
  },

  // DESCRIPTION

  description: {
    textAlign: 'center',
    fontSize: 14.5,
    lineHeight: 21,
    color: '#6B7280',
    marginTop: 11,
    marginBottom: 22,
  },

  // BUTTON

  button: {
    width: '100%',
    height: 58,
    borderRadius: 30,
    backgroundColor: '#EC4899',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EC4899',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.27,
    shadowRadius: 14,
    elevation: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  arrowContainer: {
    position: 'absolute',
    right: 7,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // DOTS

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 18,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F3B6D0',
  },

  activeDot: {
    width: 22,
    backgroundColor: '#EC4899',
  },
});