import { create } from 'zustand';
import StorageService from '../services/StorageService';

export const useWorkflowStore = create((set, get) => ({
  workflows: [],
  loading: false,
  error: null,

  // Load workflows from storage
  loadWorkflows: async () => {
    set({ loading: true });
    try {
      const workflows = await StorageService.getWorkflows();
      set({ workflows, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new workflow
  addWorkflow: async (workflow) => {
    const newWorkflow = {
      ...workflow,
      id: workflow.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: workflow.status || 'draft',
    };

    const workflows = [...get().workflows, newWorkflow];
    set({ workflows });
    await StorageService.saveWorkflows(workflows);
  },

  // Update existing workflow
  updateWorkflow: async (id, updates) => {
    const workflows = get().workflows.map((workflow) =>
      workflow.id === id
        ? { ...workflow, ...updates, updatedAt: new Date().toISOString() }
        : workflow
    );
    set({ workflows });
    await StorageService.saveWorkflows(workflows);
  },

  // Delete workflow
  deleteWorkflow: async (id) => {
    const workflows = get().workflows.filter(
      (workflow) => workflow.id !== id
    );
    set({ workflows });
    await StorageService.saveWorkflows(workflows);
  },

  // Get workflow by ID
  getWorkflow: (id) => {
    return get().workflows.find((workflow) => workflow.id === id);
  },

  // Clear all workflows
  clearWorkflows: async () => {
    set({ workflows: [] });
    await StorageService.clearWorkflows();
  },

  // Filter workflows by status
  getWorkflowsByStatus: (status) => {
    return get().workflows.filter((workflow) => workflow.status === status);
  },
}));
