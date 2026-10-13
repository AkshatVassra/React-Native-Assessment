import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/core/theme/colors';
import { Spacing } from '../../../src/core/theme/spacing';
import { Typography } from '../../../src/core/theme/typography';
import { Task } from '../../../src/domain/entities/task.entity';
import { TaskItemCard } from '../components/task/TaskItemCard';
import { TaskBloc } from '../blocs/task/task_bloc';
import { useBlocState } from '../../../src/core/bloc/bloc.provider';

interface CalendarViewScreenProps {
  taskBloc: TaskBloc;
  onEditTask: (task: Task) => void;
  onNewTask: () => void;
}

export const CalendarViewScreen: React.FC<CalendarViewScreenProps> = ({
  taskBloc,
  onEditTask,
  onNewTask,
}) => {
  const taskState = useBlocState(taskBloc);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  // Generate 7 days starting from today
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      offset: i,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      dayNumber: d.getDate(),
      fullDateStr: d.toISOString().split('T')[0],
      dateObj: d,
    };
  });

  const selectedDate = days[selectedDayOffset];

  // Filter tasks matching selected date
  const tasksForDay = taskState.allTasks.filter((t) => {
    const taskDateStr = new Date(t.dueDate).toISOString().split('T')[0];
    return taskDateStr === selectedDate.fullDateStr;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule & Shifts</Text>
          <TouchableOpacity onPress={onNewTask} style={styles.addDayTaskBtn}>
            <Ionicons name="add" size={20} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Horizontal Days Selector */}
        <View style={styles.daysContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
            {days.map((day) => {
              const isSelected = selectedDayOffset === day.offset;
              const hasTasks = taskState.allTasks.some(
                (t) => new Date(t.dueDate).toISOString().split('T')[0] === day.fullDateStr
              );

              return (
                <TouchableOpacity
                  key={day.offset}
                  onPress={() => setSelectedDayOffset(day.offset)}
                  style={[styles.dayCard, isSelected && styles.dayCardActive]}
                >
                  <Text style={[styles.dayNameText, isSelected && styles.dayTextActive]}>
                    {day.dayName}
                  </Text>
                  <Text style={[styles.dayNumberText, isSelected && styles.dayTextActive]}>
                    {day.dayNumber}
                  </Text>
                  {hasTasks && <View style={[styles.taskDot, isSelected && styles.taskDotActive]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Day Header */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryDateText}>
            {selectedDayOffset === 0
              ? 'Today'
              : selectedDayOffset === 1
              ? 'Tomorrow'
              : selectedDate.dayName}
            {', '}
            {selectedDate.dayNumber}{' '}
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
              selectedDate.dateObj.getMonth()
            ]}
          </Text>
          <Text style={styles.summaryCountText}>
            {tasksForDay.length} {tasksForDay.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>

        {/* Tasks list */}
        <ScrollView contentContainerStyle={styles.taskListContent} showsVerticalScrollIndicator={false}>
          {tasksForDay.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No tasks scheduled</Text>
              <Text style={styles.emptySubtitle}>
                Enjoy your break or schedule a new gig or delivery!
              </Text>
              <TouchableOpacity onPress={onNewTask} style={styles.emptyAddBtn}>
                <Text style={styles.emptyAddBtnText}>+ Add Task</Text>
              </TouchableOpacity>
            </View>
          ) : (
            tasksForDay.map((task) => (
              <TaskItemCard
                key={task.id}
                task={task}
                onToggleStatus={(id) => taskBloc.add({ type: 'TOGGLE_TASK_COMPLETION', taskId: id })}
                onDelete={(id) => taskBloc.add({ type: 'DELETE_TASK', taskId: id })}
                onPress={onEditTask}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  addDayTaskBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysContainer: {
    paddingVertical: Spacing.sm,
  },
  daysScroll: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 8,
  },
  dayCard: {
    width: 58,
    height: 74,
    borderRadius: Spacing.radiusMd,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dayTextActive: {
    color: Colors.textWhite,
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  taskDotActive: {
    backgroundColor: Colors.textWhite,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.sm,
  },
  summaryDateText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  taskListContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  emptyAddBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: Colors.primarySoft,
    borderRadius: Spacing.radiusPill,
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
