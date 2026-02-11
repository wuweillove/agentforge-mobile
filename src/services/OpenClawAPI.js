import axios from 'axios';
import { getApiKey } from './SecureStorage';

const API_BASE_URL = 'https://api.openclaw.io/v1';

class OpenClawAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const apiKey = await getApiKey('openclaw');
        if (apiKey) {
          config.headers.Authorization = `Bearer ${apiKey}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  // Workflow Management
  async deployWorkflow(workflow) {
    try {
      const response = await this.client.post('/workflows', workflow);
      return response;
    } catch (error) {
      throw new Error(`Failed to deploy workflow: ${error.message}`);
    }
  }

  async getWorkflow(workflowId) {
    try {
      const response = await this.client.get(`/workflows/${workflowId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch workflow: ${error.message}`);
    }
  }

  async updateWorkflow(workflowId, updates) {
    try {
      const response = await this.client.put(`/workflows/${workflowId}`, updates);
      return response;
    } catch (error) {
      throw new Error(`Failed to update workflow: ${error.message}`);
    }
  }

  async deleteWorkflow(workflowId) {
    try {
      await this.client.delete(`/workflows/${workflowId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete workflow: ${error.message}`);
    }
  }

  // Agent Execution
  async executeWorkflow(workflowId, input) {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/execute`, {
        input,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to execute workflow: ${error.message}`);
    }
  }

  async getExecutionStatus(executionId) {
    try {
      const response = await this.client.get(`/executions/${executionId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch execution status: ${error.message}`);
    }
  }

  async getExecutionLogs(executionId) {
    try {
      const response = await this.client.get(`/executions/${executionId}/logs`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch execution logs: ${error.message}`);
    }
  }

  // Monitoring
  async getAgentMetrics(workflowId, timeRange = '24h') {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/metrics`, {
        params: { timeRange },
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }
  }

  async listExecutions(workflowId, limit = 50) {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/executions`, {
        params: { limit },
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to list executions: ${error.message}`);
    }
  }

  // Templates
  async getTemplates() {
    try {
      const response = await this.client.get('/templates');
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }
  }

  async saveTemplate(template) {
    try {
      const response = await this.client.post('/templates', template);
      return response;
    } catch (error) {
      throw new Error(`Failed to save template: ${error.message}`);
    }
  }
}

export default new OpenClawAPI();