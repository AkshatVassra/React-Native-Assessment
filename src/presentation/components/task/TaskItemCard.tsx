import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing, Shadows } from '../../../../src/core/theme/spacing';
import { Typography } from '../../../../src/core/theme/typography';
import { Task } from '../../../../src/domain/entities/task.entity';
import { formatShortDate } from '../../../../src/core/utils/date.utils';
import { CategoryTag, PriorityBadge } from '../common/PriorityBadge';

interface TaskItemCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onPress: (task: Task) => void;
  style?: ViewStyle;
}

export const TaskItemCard: React.FC<TaskItemCardProps> = ({
  task,
  onToggleStatus,
  onDelete,
  onPress,
  style,
}) => {
  const formattedDate = formatShortDate(task.dueDate);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPress(task)}
      style={[
        styles.cardContainer,
        task.isCompleted && styles.completedCard,
        style,
      ]}
    >
      {/* Checkbox circle on the left */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onToggleStatus(task.id)}
        style={[
          styles.checkboxCircle,
          task.isCompleted && styles.checkboxCompleted,
        ]}
      >
        {task.isCompleted ? (
          <Ionicons name="checkmark-sharp" size={14} color={Colors.textWhite} />
        ) : (
          <View style={styles.checkboxInnerHole} />
        )}
      </TouchableOpacity>

      {/* Task Information in the center */}
      <View style={styles.contentContainer}>
        <Text
          numberOfLines={1}
          style={[
            styles.titleText,
            task.isCompleted && styles.completedTitleText,
          ]}
        >
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          {task.category ? <CategoryTag name={task.category} /> : null}
          <PriorityBadge priority={task.priority} style={styles.priorityBadge} />
        </View>
      </View>

      {/* Direct Delete button on right, exactly matching screenshot 1 */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={17} color={Colors.textWhite} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusCard,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    ...Shadows.subtle,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  completedCard: {
    backgroundColor: '#FAFBFE',
    opacity: 0.8,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxInnerHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  titleText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  completedTitleText: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginRight: 6,
    fontSize: 12,
  },
  priorityBadge: {
    marginLeft: 6,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.deleteRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.deleteRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
