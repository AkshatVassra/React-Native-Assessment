import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing } from '../../../../src/core/theme/spacing';
import { Typography } from '../../../../src/core/theme/typography';
import { formatHeaderDate } from '../../../../src/core/utils/date.utils';

interface HeaderCurvedProps {
  dateLabel?: string;
  title?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGridPress?: () => void;
  onMenuPress?: () => void;
}

export const HeaderCurved: React.FC<HeaderCurvedProps> = ({
  dateLabel,
  title = 'My tasks',
  searchQuery,
  onSearchChange,
  onGridPress,
  onMenuPress,
}) => {
  const currentDate = dateLabel || formatHeaderDate();

  return (
    <View style={styles.headerContainer}>
      {/* Top action row: Grid Icon, Search Pill, Menu */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGridPress}
          style={styles.headerIconButton}
        >
          <Ionicons name="grid-outline" size={22} color={Colors.textWhite} />
        </TouchableOpacity>

        {/* Search input pill */}
        <View style={styles.searchPill}>
          <Ionicons name="search" size={17} color={Colors.primary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#A0A5BA"
            value={searchQuery}
            onChangeText={onSearchChange}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {Boolean(searchQuery) && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchBtn}>
              <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onMenuPress}
          style={styles.headerIconButton}
        >
          <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Title & Date display */}
      <View style={styles.titleArea}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      {/* Decorative curved bottom background element */}
      <View style={styles.bottomCurveDecorator} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'web' ? 24 : 12,
    paddingHorizontal: Spacing.md,
    paddingBottom: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomCurveDecorator: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    pointerEvents: 'none',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: 8,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPill: {
    flex: 1,
    height: 38,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusPill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: Colors.textPrimary,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 2,
  },
  titleArea: {
    paddingHorizontal: Spacing.sm,
    marginTop: 4,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  titleText: {
    color: Colors.textWhite,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
