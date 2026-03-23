import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import { useTaskStore } from "@/src/store/task.store";
import { TaskCard } from "@/src/components/tasks/TaskCard";
import type { Task, NewTask } from "@/src/db/schema";

type Category = Task["category"] | "all";
const CATEGORIES: Category[] = ["all", "work", "personal", "health", "errands"];

export default function TasksScreen() {
  const { tasks, loadTasks, addTask, toggleDone, deleteTask, overdueTasks } = useTaskStore();
  const [filter, setFilter] = useState<Category>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => { loadTasks(); }, []);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.category === filter);
  const overdue = overdueTasks();

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const data: NewTask = { title: newTitle.trim(), category: "personal", priority: "P2" };
    await addTask(data);
    setNewTitle("");
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.fab}>
          <Text style={styles.fabText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {overdue.length > 0 && (
        <View style={styles.overdueBar}>
          <Text style={styles.overdueText}>
            {overdue.length} overdue task{overdue.length > 1 ? "s" : ""}  ask Jarvis to reschedule
          </Text>
        </View>
      )}

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c}
        style={styles.filterList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setFilter(item)}
            style={[styles.filterChip, filter === item && styles.filterActive]}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleDone} onDelete={deleteTask} />
        )}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet  tell Jarvis to add one!</Text>
        }
      />

      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <Text style={styles.modalTitle}>New Task</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Task title..."
            value={newTitle}
            onChangeText={setNewTitle}
            autoFocus
          />
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={() => setShowAdd(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F8FC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1A1A2E" },
  fab: { backgroundColor: "#6C63FF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  overdueBar: { backgroundColor: "#FFF3CD", paddingHorizontal: 20, paddingVertical: 8 },
  overdueText: { color: "#856404", fontSize: 13, fontWeight: "600" },
  filterList: { paddingHorizontal: 12, paddingVertical: 8, maxHeight: 48 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: "#EBEBF0", marginHorizontal: 4 },
  filterActive: { backgroundColor: "#6C63FF" },
  filterText: { fontSize: 13, color: "#666", fontWeight: "600", textTransform: "capitalize" },
  filterTextActive: { color: "#fff" },
  empty: { textAlign: "center", color: "#aaa", marginTop: 60, fontSize: 15 },
  modal: { flex: 1, padding: 24, gap: 16 },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#1A1A2E" },
  modalInput: { backgroundColor: "#F5F5FA", borderRadius: 12, padding: 14, fontSize: 16 },
  modalActions: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#DDD", alignItems: "center" },
  cancelText: { fontSize: 15, color: "#666" },
  addBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: "#6C63FF", alignItems: "center" },
  addBtnText: { fontSize: 15, color: "#fff", fontWeight: "700" },
});
