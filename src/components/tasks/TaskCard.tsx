import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Task } from '../../db/schema';

const PRIORITY_COLOR: Record<string, string> = { P1: '#FF6B6B', P2: '#FFA94D', P3: '#69DB7C' };
const CATEGORY_COLOR: Record<string, string> = {
  work: '#4C6EF5',
  personal: '#9775FA',
  health: '#20C997',
  errands: '#FCC419',
};

interface Props {
  task: Task;
  onToggle: (id: number, done: boolean) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <View style={[styles.card, task.done && styles.done]}>
      <TouchableOpacity onPress={() => onToggle(task.id, !task.done)} style={styles.checkbox}>
        <View style={[styles.checkCircle, task.done && styles.checked]} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.title, task.done && styles.doneText]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: CATEGORY_COLOR[task.category] + '22' }]}>
            <Text style={[styles.badgeText, { color: CATEGORY_COLOR[task.category] }]}>
              {task.category}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: PRIORITY_COLOR[task.priority] + '22' }]}>
            <Text style={[styles.badgeText, { color: PRIORITY_COLOR[task.priority] }]}>
              {task.priority}
            </Text>
          </View>
          {task.dueDate && (
            <Text style={styles.dueDate}>{task.dueDate.slice(0, 10)}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  done: { opacity: 0.5 },
  checkbox: { marginRight: 12 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  checked: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginBottom: 6 },
  doneText: { textDecorationLine: 'line-through', color: '#999' },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  dueDate: { fontSize: 11, color: '#999' },
  deleteBtn: { padding: 6 },
  deleteText: { color: '#ccc', fontSize: 16 },
});
