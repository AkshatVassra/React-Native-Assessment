import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/core/theme/colors';
import { Spacing } from '../../../src/core/theme/spacing';
import { Typography } from '../../../src/core/theme/typography';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Centered illustration area matching screenshot 2 screen 1 */}
        <View style={styles.illustrationArea}>
          {/* Confetti particles */}
          <View style={[styles.particle, styles.particle1]} />
          <View style={[styles.particle, styles.particle2]} />
          <View style={[styles.particle, styles.particle3]} />
          <View style={[styles.particle, styles.particle4]} />
          <View style={[styles.particle, styles.particle5]} />
          <View style={[styles.particle, styles.particle6]} />

          {/* Central purple rounded squircle with white checkmark */}
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-sharp" size={48} color={Colors.textWhite} />
          </View>
        </View>

        {/* Content Headline and Subtitle */}
        <View style={styles.contentArea}>
          <Text style={styles.headline}>Get things done.</Text>
          <Text style={styles.subtitle}>
            Just a click away from{'\n'}planning your tasks.
          </Text>

          {/* 3 Pagination dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Bottom decorative curved quarter-circle with right arrow button */}
        <View style={styles.bottomQuarterCircleContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onGetStarted}
            style={styles.quarterCircleButton}
          >
            <Ionicons name="arrow-forward" size={32} color={Colors.textWhite} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    position: 'relative',
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    position: 'relative',
    height: 180,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  particle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  particle1: {
    width: 8,
    height: 8,
    backgroundColor: '#FFA940',
    top: 20,
    left: width / 2 - 80,
  },
  particle2: {
    width: 6,
    height: 6,
    backgroundColor: '#36CFC9',
    bottom: 30,
    left: width / 2 - 75,
  },
  particle3: {
    width: 10,
    height: 10,
    backgroundColor: '#597EF7',
    top: 30,
    right: width / 2 - 80,
  },
  particle4: {
    width: 6,
    height: 6,
    backgroundColor: '#FF7A45',
    bottom: 25,
    right: width / 2 - 70,
  },
  particle5: {
    width: 7,
    height: 7,
    backgroundColor: '#9254DE',
    top: 10,
    right: width / 2 - 30,
  },
  particle6: {
    width: 5,
    height: 5,
    backgroundColor: '#FAAD14',
    bottom: 10,
    left: width / 2 - 20,
  },
  contentArea: {
    alignItems: 'flex-start',
    marginBottom: 100,
    paddingLeft: Spacing.sm,
  },
  headline: {
    ...Typography.h1,
    fontSize: 28,
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#DFE2E9',
  },
  activeDot: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  bottomQuarterCircleContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    overflow: 'hidden',
  },
  quarterCircleButton: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
    paddingRight: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  arrowIcon: {
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
});
