import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing } from '../../../../src/core/theme/spacing';
import { Typography } from '../../../../src/core/theme/typography';
import { Task, TaskPriority } from '../../../../src/domain/entities/task.entity';
import { CustomButton } from '../common/CustomButton';

interface TaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    category: string;
  }) => void;
  initialTask?: Task | null;
  onDelete?: (taskId: string) => void;
}

const CATEGORIES = ['Personal', 'Work', 'Delivery', 'Rideshare', 'Study', 'General'];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialTask,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDatePreset, setDueDatePreset] = useState<'today' | 'tomorrow' | '3days' | 'week'>('today');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setPriority(initialTask.priority);
      setCategory(initialTask.category || 'Personal');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Personal');
      setDueDatePreset('today');
    }
    setError(null);
  }, [initialTask, visible]);

  const calculateDueDate = (): string => {
    if (initialTask && !dueDatePreset) {
      return initialTask.dueDate;
    }
    const d = new Date();
    d.setHours(18, 0, 0, 0);

    if (dueDatePreset === 'tomorrow') {
      d.setDate(d.getDate() + 1);
    } else if (dueDatePreset === '3days') {
      d.setDate(d.getDate() + 3);
    } else if (dueDatePreset === 'week') {
      d.setDate(d.getDate() + 7);
    }
    return d.toISOString();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    setError(null);

    const resolvedDate = calculateDueDate();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: resolvedDate,
      priority,
      category,
    });
    onClose();
  };

  const isEditing = Boolean(initialTask);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Title field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TASK TITLE *</Text>
              <TextInput
                placeholder="e.g. Deliver grocery order #304"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (error) setError(null);
                }}
                style={[styles.textInput, Boolean(error) && styles.inputError]}
              />
              {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Description field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIPTION</Text>
              <TextInput
                placeholder="Add notes, client address, or instructions..."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={[styles.textInput, styles.textArea]}
              />
            </View>

            {/* Due Date Presets */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DUE DATE</Text>
              <View style={styles.chipRow}>
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'tomorrow', label: 'Tomorrow' },
                  { key: '3days', label: 'In 3 Days' },
                  { key: 'week', label: 'Next Week' },
                ].map((item) => {
                  const isSelected = dueDatePreset === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => setDueDatePreset(item.key as any)}
                      style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    >
                      <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Priority Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PRIORITY *</Text>
              <View style={styles.prioritySelectorRow}>
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  const getColors = () => {
                    if (p === 'high') return { bg: Colors.priorityHighBg, color: Colors.priorityHigh };
                    if (p === 'medium') return { bg: Colors.priorityMediumBg, color: Colors.priorityMedium };
                    return { bg: Colors.priorityLowBg, color: Colors.priorityLow };
                  };
                  const c = getColors();

                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.prioritySelectBtn,
                        isSelected && { borderColor: c.color, backgroundColor: c.bg, borderWidth: 2 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.prioritySelectText,
                          { color: isSelected ? c.color : Colors.textSecondary },
                        ]}
                      >
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CATEGORY TAG</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                    >
                      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Submit & Delete Buttons */}
            <View style={styles.actionButtonsContainer}>
              <CustomButton
                title={isEditing ? 'Save Changes' : 'Create Task'}
                onPress={handleSubmit}
                style={styles.submitBtn}
              />

              {isEditing && initialTask && onDelete && (
                <CustomButton
                  title="Delete Task"
                  variant="danger"
                  onPress={() => {
                    onDelete(initialTask.id);
                    onClose();
                  }}
                  style={styles.deleteBtn}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: Spacing.radiusMd,
    paddingHorizontal: Spacing.md,
    height: 48,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Spacing.radiusPill,
    backgroundColor: '#EEF0F8',
  },
  presetChipActive: {
    backgroundColor: Colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  presetChipTextActive: {
    color: Colors.textWhite,
    fontWeight: '700',
  },
  prioritySelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prioritySelectBtn: {
    flex: 1,
    height: 40,
    borderRadius: Spacing.radiusMd,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  prioritySelectText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Spacing.radiusPill,
    backgroundColor: Colors.inputBg,
  },
  categoryChipActive: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  actionButtonsContainer: {
    marginTop: Spacing.md,
    gap: 10,
  },
  submitBtn: {
    width: '100%',
  },
  deleteBtn: {
    width: '100%',
    height: 48,
  },
});
