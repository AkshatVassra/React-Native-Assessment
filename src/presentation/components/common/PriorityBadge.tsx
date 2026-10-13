import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing } from '../../../../src/core/theme/spacing';
import { Typography } from '../../../../src/core/theme/typography';
import { TaskPriority } from '../../../../src/domain/entities/task.entity';

interface PriorityBadgeProps {
  priority: TaskPriority;
  style?: ViewStyle;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, style }) => {
  const getConfig = () => {
    switch (priority) {
      case 'high':
        return { label: 'High', bg: Colors.priorityHighBg, color: Colors.priorityHigh };
      case 'medium':
        return { label: 'Med', bg: Colors.priorityMediumBg, color: Colors.priorityMedium };
      case 'low':
      default:
        return { label: 'Low', bg: Colors.priorityLowBg, color: Colors.priorityLow };
    }
  };

  const { label, bg, color } = getConfig();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

interface CategoryTagProps {
  name: string;
  style?: ViewStyle;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ name, style }) => {
  const getTagColor = (tagName: string) => {
    const key = tagName.toLowerCase();
    if (key.includes('personal')) return Colors.tags.personal;
    if (key.includes('work')) return Colors.tags.work;
    if (key.includes('deliver')) return Colors.tags.delivery;
    if (key.includes('ride') || key.includes('uber')) return Colors.tags.rideshare;
    if (key.includes('urgent')) return Colors.tags.urgent;
    if (key.includes('study') || key.includes('learn')) return Colors.tags.study;
    return Colors.tags.general;
  };

  const tagStyle = getTagColor(name);

  return (
    <View style={[styles.tag, { backgroundColor: tagStyle.bg }, style]}>
      <Text style={[styles.tagText, { color: tagStyle.text }]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Spacing.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
