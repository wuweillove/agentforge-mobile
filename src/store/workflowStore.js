import { create } from 'zustand';
import StorageService from '../services/StorageService';
import { generateId } from '../utils/helpers';

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
      id: workflow.id || generateId(),
      name: workflow.name,
      description: workflow.description || '',
      nodes: workflow.nodes || [],
      connections: workflow.connections || [],
      status: workflow.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...workflow,
    };

    const workflows = [...get().workflows, newWorkflow];
    set({ workflows });
    await StorageService.saveWorkflows(workflows);
    return newWorkflow;
  },

  // Update workflow
  updateWorkflow: async (id, updates) => {
    const workflows = get().workflows.map(workflow =>
      workflow.id === id
        ? { ...workflow, ...updates, updatedAt: new Date().toISOString() }
        : workflow
    );
    set({ workflows });
    await StorageService.saveWorkflows(workflows);
  },

  // Delete workflow
  deleteWorkflow: async (id) => {
    const workflows = get().workflows.filter(workflow => workflow.id !== id);
    set({ workflows });
    await StorageService.saveWorkflows(workflows);
  },

  // Get workflow by ID
  getWorkflow: (id) => {
    return get().workflows.find(workflow => workflow.id === id);
  },

  // Clear all workflows
  clearWorkflows: async () => {
    set({ workflows: [] });
    await StorageService.saveWorkflows([]);
  },

  // Duplicate workflow
  duplicateWorkflow: async (id) => {
    const workflow = get().getWorkflow(id);
    if (!workflow) return null;

    const duplicate = {
      ...workflow,
      id: generateId(),
      name: `${workflow.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    return get().addWorkflow(duplicate);
  },
}));