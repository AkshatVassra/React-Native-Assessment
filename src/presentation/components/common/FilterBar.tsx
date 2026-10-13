import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing } from '../../../../src/core/theme/spacing';
import {
  TaskPriorityFilter,
  TaskStatusFilter,
} from '../../../../src/domain/entities/task.entity';

interface FilterBarProps {
  currentStatus: TaskStatusFilter;
  currentPriority: TaskPriorityFilter;
  onStatusChange: (status: TaskStatusFilter) => void;
  onPriorityChange: (priority: TaskPriorityFilter) => void;
  taskCounts?: {
    total: number;
    pending: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentStatus,
  currentPriority,
  onStatusChange,
  onPriorityChange,
  taskCounts,
}) => {
  const statusOptions: { key: TaskStatusFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: taskCounts?.total },
    { key: 'pending', label: 'Incomplete', count: taskCounts?.pending },
    { key: 'completed', label: 'Completed', count: taskCounts?.completed },
  ];

  const priorityOptions: { key: TaskPriorityFilter; label: string; color?: string }[] = [
    { key: 'all', label: 'All Priorities' },
    { key: 'high', label: '🔴 High' },
    { key: 'medium', label: '🟠 Medium' },
    { key: 'low', label: '🟢 Low' },
  ];

  return (
    <View style={styles.container}>
      {/* Status Segment Control */}
      <View style={styles.statusSegmentContainer}>
        {statusOptions.map((opt) => {
          const isActive = currentStatus === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.8}
              onPress={() => onStatusChange(opt.key)}
              style={[styles.statusSegmentBtn, isActive && styles.statusSegmentActive]}
            >
              <Text
                style={[styles.statusSegmentText, isActive && styles.statusSegmentTextActive]}
              >
                {opt.label}
                {typeof opt.count === 'number' ? ` (${opt.count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Priority Horizontal Filter Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.priorityScrollContent}
      >
        <Text style={styles.priorityLabel}>Priority:</Text>
        {priorityOptions.map((p) => {
          const isActive = currentPriority === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              activeOpacity={0.7}
              onPress={() => onPriorityChange(p.key)}
              style={[
                styles.priorityChip,
                isActive && styles.priorityChipActive,
              ]}
            >
              <Text
                style={[
                  styles.priorityChipText,
                  isActive && styles.priorityChipTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  statusSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF0F8',
    borderRadius: Spacing.radiusPill,
    padding: 3,
    marginBottom: Spacing.sm,
  },
  statusSegmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.radiusPill,
  },
  statusSegmentActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusSegmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  statusSegmentTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  priorityScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 6,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginRight: 4,
  },
  priorityChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Spacing.radiusPill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priorityChipActive: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  priorityChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  priorityChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
