import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/core/theme/colors';
import { Spacing, Shadows } from '../../../src/core/theme/spacing';
import { Typography } from '../../../src/core/theme/typography';
import { Task } from '../../../src/domain/entities/task.entity';
import { HeaderCurved } from '../components/common/HeaderCurved';
import { FilterBar } from '../components/common/FilterBar';
import { TaskItemCard } from '../components/task/TaskItemCard';
import { TaskSectionHeader } from '../components/task/TaskSectionHeader';
import { TaskFormModal } from '../components/task/TaskFormModal';
import { CalendarViewScreen } from './CalendarViewScreen';
import { TaskBloc } from '../blocs/task/task_bloc';
import { AuthBloc } from '../blocs/auth/auth_bloc';
import { useBlocState } from '../../../src/core/bloc/bloc.provider';
import { getTaskTimeBucket, TaskTimeBucket } from '../../../src/core/utils/date.utils';

interface HomeScreenProps {
  taskBloc: TaskBloc;
  authBloc: AuthBloc;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ taskBloc, authBloc }) => {
  const taskState = useBlocState(taskBloc);
  const authState = useBlocState(authBloc);

  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar'>('tasks');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  // Group filtered tasks by buckets matching screenshot: "Today", "Tomorrow", "This week", "Later", "Overdue"
  const groupedTasks: Record<TaskTimeBucket, Task[]> = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    'This week': [],
    Later: [],
  };

  taskState.filteredTasks.forEach((task) => {
    const bucket = getTaskTimeBucket(task.dueDate);
    groupedTasks[bucket].push(task);
  });

  const handleCreateOrUpdateTask = (data: {
    title: string;
    description: string;
    dueDate: string;
    priority: any;
    category: string;
  }) => {
    if (selectedTaskForEdit) {
      taskBloc.add({
        type: 'UPDATE_TASK',
        task: {
          ...selectedTaskForEdit,
          ...data,
        },
      });
    } else {
      taskBloc.add({
        type: 'CREATE_TASK',
        ...data,
      });
    }
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTaskForEdit(task);
    setModalVisible(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedTaskForEdit(null);
    setModalVisible(true);
  };

  const handleToggleTask = (taskId: string) => {
    taskBloc.add({ type: 'TOGGLE_TASK_COMPLETION', taskId });
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => taskBloc.add({ type: 'DELETE_TASK', taskId }),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Do you wish to log out from GigTask?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => authBloc.add({ type: 'LOGOUT_REQUESTED' }),
      },
    ]);
  };

  const handleMenuPress = () => {
    const userEmail = authState.user?.email || 'Gig Worker';
    Alert.alert(
      'Account & Settings',
      `Logged in as: ${userEmail}\n\nTasks Total: ${taskState.allTasks.length}\nCompleted: ${
        taskState.allTasks.filter((t) => t.isCompleted).length
      }`,
      [
        { text: 'Log Out', style: 'destructive', onPress: handleLogout },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const pendingCount = taskState.allTasks.filter((t) => !t.isCompleted).length;
  const completedCount = taskState.allTasks.filter((t) => t.isCompleted).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {activeTab === 'calendar' ? (
          <CalendarViewScreen
            taskBloc={taskBloc}
            onEditTask={handleOpenEditModal}
            onNewTask={handleOpenCreateModal}
          />
        ) : (
          <View style={styles.screenBody}>
            {/* Curved Header matching Screenshot 1 */}
            <HeaderCurved
              title="My tasks"
              searchQuery={taskState.filter.searchQuery || ''}
              onSearchChange={(q) => taskBloc.add({ type: 'SEARCH_QUERY_CHANGED', query: q })}
              onMenuPress={handleMenuPress}
            />

            {/* Filter Bar: Status & Priority */}
            <FilterBar
              currentStatus={taskState.filter.status}
              currentPriority={taskState.filter.priority}
              onStatusChange={(status) => taskBloc.add({ type: 'FILTER_STATUS_CHANGED', status })}
              onPriorityChange={(priority) => taskBloc.add({ type: 'FILTER_PRIORITY_CHANGED', priority })}
              taskCounts={{
                total: taskState.allTasks.length,
                pending: pendingCount,
                completed: completedCount,
              }}
            />

            {/* Tasks list grouped by sections matching Screenshot 1 */}
            <ScrollView
              contentContainerStyle={styles.scrollListContent}
              showsVerticalScrollIndicator={false}
            >
              {taskState.filteredTasks.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="clipboard-outline" size={54} color={Colors.textMuted} />
                  <Text style={styles.emptyStateTitle}>No tasks match your filters</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Try clearing search query or adjust your filters above.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Overdue Section */}
                  {groupedTasks.Overdue.length > 0 && (
                    <View style={styles.sectionBlock}>
                      <TaskSectionHeader title="Overdue" count={groupedTasks.Overdue.length} />
                      {groupedTasks.Overdue.map((task) => (
                        <TaskItemCard
                          key={task.id}
                          task={task}
                          onToggleStatus={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onPress={handleOpenEditModal}
                        />
                      ))}
                    </View>
                  )}

                  {/* Today Section */}
                  {groupedTasks.Today.length > 0 && (
                    <View style={styles.sectionBlock}>
                      <TaskSectionHeader title="Today" count={groupedTasks.Today.length} />
                      {groupedTasks.Today.map((task) => (
                        <TaskItemCard
                          key={task.id}
                          task={task}
                          onToggleStatus={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onPress={handleOpenEditModal}
                        />
                      ))}
                    </View>
                  )}

                  {/* Tomorrow Section */}
                  {groupedTasks.Tomorrow.length > 0 && (
                    <View style={styles.sectionBlock}>
                      <TaskSectionHeader title="Tomorrow" count={groupedTasks.Tomorrow.length} />
                      {groupedTasks.Tomorrow.map((task) => (
                        <TaskItemCard
                          key={task.id}
                          task={task}
                          onToggleStatus={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onPress={handleOpenEditModal}
                        />
                      ))}
                    </View>
                  )}

                  {/* This Week Section */}
                  {groupedTasks['This week'].length > 0 && (
                    <View style={styles.sectionBlock}>
                      <TaskSectionHeader title="This week" count={groupedTasks['This week'].length} />
                      {groupedTasks['This week'].map((task) => (
                        <TaskItemCard
                          key={task.id}
                          task={task}
                          onToggleStatus={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onPress={handleOpenEditModal}
                        />
                      ))}
                    </View>
                  )}

                  {/* Later Section */}
                  {groupedTasks.Later.length > 0 && (
                    <View style={styles.sectionBlock}>
                      <TaskSectionHeader title="Later" count={groupedTasks.Later.length} />
                      {groupedTasks.Later.map((task) => (
                        <TaskItemCard
                          key={task.id}
                          task={task}
                          onToggleStatus={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onPress={handleOpenEditModal}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        )}

        {/* Bottom Navigation Bar with Centered FAB Button matching Screenshot 1 */}
        <View style={styles.bottomNavContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('tasks')}
            style={styles.navTabButton}
          >
            <Ionicons
              name={activeTab === 'tasks' ? 'list' : 'list-outline'}
              size={26}
              color={activeTab === 'tasks' ? Colors.primary : Colors.inactiveIcon}
            />
          </TouchableOpacity>

          {/* Floating Action '+' Button in the middle */}
          <View style={styles.fabWrapper}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleOpenCreateModal}
              style={styles.fabButton}
            >
              <Ionicons name="add" size={28} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('calendar')}
            style={styles.navTabButton}
          >
            <Ionicons
              name={activeTab === 'calendar' ? 'calendar' : 'calendar-outline'}
              size={24}
              color={activeTab === 'calendar' ? Colors.primary : Colors.inactiveIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Create / Edit Task Modal */}
        <TaskFormModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleCreateOrUpdateTask}
          initialTask={selectedTaskForEdit}
          onDelete={handleDeleteTask}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  screenBody: {
    flex: 1,
  },
  scrollListContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 110,
  },
  sectionBlock: {
    marginBottom: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptyStateSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 14 : 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  navTabButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrapper: {
    position: 'relative',
    top: -24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.floatButton,
  },
});
