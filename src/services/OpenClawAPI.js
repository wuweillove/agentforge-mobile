import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.openclaw.io';

class OpenClawAPI {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/v1`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.apiKey = null;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  }

  // Workflow Management
  async deployWorkflow(workflow) {
    try {
      const response = await this.client.post('/workflows', {
        name: workflow.name,
        description: workflow.description,
        nodes: workflow.nodes,
        connections: workflow.connections,
        config: workflow.config,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getWorkflow(workflowId) {
    try {
      const response = await this.client.get(`/workflows/${workflowId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateWorkflow(workflowId, updates) {
    try {
      const response = await this.client.put(`/workflows/${workflowId}`, updates);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async deleteWorkflow(workflowId) {
    try {
      await this.client.delete(`/workflows/${workflowId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async listWorkflows() {
    try {
      const response = await this.client.get('/workflows');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Agent Execution
  async executeWorkflow(workflowId, input) {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/execute`, {
        input,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getExecutionStatus(executionId) {
    try {
      const response = await this.client.get(`/executions/${executionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async stopExecution(executionId) {
    try {
      await this.client.post(`/executions/${executionId}/stop`);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Monitoring
  async getExecutionLogs(executionId) {
    try {
      const response = await this.client.get(`/executions/${executionId}/logs`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getMetrics(workflowId, timeRange = '24h') {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/metrics`, {
        params: { timeRange },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Templates
  async listTemplates(category = null) {
    try {
      const params = category ? { category } : {};
      const response = await this.client.get('/templates', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getTemplate(templateId) {
    try {
      const response = await this.client.get(`/templates/${templateId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Error Handling
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || 'Server error',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server',
        status: 0,
      };
    } else {
      // Error in request setup
      return {
        message: error.message || 'Request failed',
        status: -1,
      };
    }
  }
}

export default new OpenClawAPI();
