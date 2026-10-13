import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing } from '../../../../src/core/theme/spacing';
import { Typography } from '../../../../src/core/theme/typography';

interface TaskSectionHeaderProps {
  title: string;
  count?: number;
}

export const TaskSectionHeader: React.FC<TaskSectionHeaderProps> = ({ title, count }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.titleText}>{title}</Text>
      {typeof count === 'number' && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  titleText: {
    ...Typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countBadge: {
    marginLeft: Spacing.sm,
    backgroundColor: '#E8EAF6',
    borderRadius: Spacing.radiusPill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});
