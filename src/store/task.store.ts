import { create } from 'zustand';
import { taskRepo } from '../db/repositories/task.repo';
import type { Task, NewTask } from '../db/schema';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  loadTasks: () => Promise<void>;
  addTask: (data: NewTask) => Promise<void>;
  toggleDone: (id: number, done: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  overdueTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    const all = await taskRepo.getAll();
    set({ tasks: all, isLoading: false });
  },

  addTask: async (data) => {
    await taskRepo.create(data);
    await get().loadTasks();
  },

  toggleDone: async (id, done) => {
    await taskRepo.toggleDone(id, done);
    await get().loadTasks();
  },

  deleteTask: async (id) => {
    await taskRepo.delete(id);
    await get().loadTasks();
  },

  overdueTasks: () => {
    const now = new Date().toISOString();
    return get().tasks.filter(
      (t) => !t.done && t.dueDate != null && t.dueDate < now,
    );
  },
}));
