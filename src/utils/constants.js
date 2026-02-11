export const NODE_TYPES = [
  {
    type: 'input',
    label: 'Input',
    icon: 'import',
    color: '#6C5CE7',
    description: 'Receive data from external sources',
    defaultConfig: {
      dataType: 'text',
      source: 'manual',
    },
  },
  {
    type: 'process',
    label: 'Process',
    icon: 'cog',
    color: '#00B894',
    description: 'Transform and manipulate data',
    defaultConfig: {
      operation: 'transform',
    },
  },
  {
    type: 'decision',
    label: 'Decision',
    icon: 'call-split',
    color: '#FDCB6E',
    description: 'Branch workflow based on conditions',
    defaultConfig: {
      condition: '',
      trueAction: null,
      falseAction: null,
    },
  },
  {
    type: 'api_call',
    label: 'API Call',
    icon: 'cloud-upload',
    color: '#74B9FF',
    description: 'Make HTTP requests to external APIs',
    defaultConfig: {
      method: 'GET',
      url: '',
      headers: {},
    },
  },
  {
    type: 'llm',
    label: 'LLM',
    icon: 'brain',
    color: '#A29BFE',
    description: 'Process with Large Language Model',
    defaultConfig: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    },
  },
  {
    type: 'database',
    label: 'Database',
    icon: 'database',
    color: '#00CEC9',
    description: 'Store or retrieve data from database',
    defaultConfig: {
      operation: 'query',
      table: '',
    },
  },
  {
    type: 'output',
    label: 'Output',
    icon: 'export',
    color: '#FF6B6B',
    description: 'Send results to destination',
    defaultConfig: {
      destination: 'console',
      format: 'json',
    },
  },
];

export const WORKFLOW_TEMPLATES = [
  {
    id: 'template-1',
    name: 'Data Processing Pipeline',
    description: 'Extract, transform, and load data from various sources into your database with automated validation.',
    category: 'Data Processing',
    icon: 'database-sync',
    uses: 234,
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        label: 'CSV Input',
        position: { x: 50, y: 100 },
      },
      {
        id: 'node-2',
        type: 'process',
        label: 'Transform Data',
        position: { x: 250, y: 100 },
      },
      {
        id: 'node-3',
        type: 'database',
        label: 'Store in DB',
        position: { x: 450, y: 100 },
      },
    ],
    connections: [
      { from: 'node-1', to: 'node-2' },
      { from: 'node-2', to: 'node-3' },
    ],
  },
  {
    id: 'template-2',
    name: 'Email Automation',
    description: 'Automatically send personalized emails based on triggers with dynamic content generation.',
    category: 'Communication',
    icon: 'email-fast',
    uses: 189,
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        label: 'Trigger Event',
        position: { x: 50, y: 100 },
      },
      {
        id: 'node-2',
        type: 'llm',
        label: 'Generate Email',
        position: { x: 250, y: 100 },
      },
      {
        id: 'node-3',
        type: 'api_call',
        label: 'Send Email',
        position: { x: 450, y: 100 },
      },
    ],
    connections: [
      { from: 'node-1', to: 'node-2' },
      { from: 'node-2', to: 'node-3' },
    ],
  },
  {
    id: 'template-3',
    name: 'Content Analysis',
    description: 'Analyze text content for sentiment, keywords, and topics using AI models.',
    category: 'Analysis',
    icon: 'text-search',
    uses: 156,
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        label: 'Text Input',
        position: { x: 50, y: 100 },
      },
      {
        id: 'node-2',
        type: 'llm',
        label: 'Analyze Content',
        position: { x: 250, y: 100 },
      },
      {
        id: 'node-3',
        type: 'output',
        label: 'Display Results',
        position: { x: 450, y: 100 },
      },
    ],
    connections: [
      { from: 'node-1', to: 'node-2' },
      { from: 'node-2', to: 'node-3' },
    ],
  },
  {
    id: 'template-4',
    name: 'Smart Workflow Router',
    description: 'Route data to different processing paths based on intelligent decision logic.',
    category: 'Automation',
    icon: 'routes',
    uses: 98,
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        label: 'Data Input',
        position: { x: 50, y: 150 },
      },
      {
        id: 'node-2',
        type: 'decision',
        label: 'Check Condition',
        position: { x: 250, y: 150 },
      },
      {
        id: 'node-3',
        type: 'process',
        label: 'Path A',
        position: { x: 450, y: 50 },
      },
      {
        id: 'node-4',
        type: 'process',
        label: 'Path B',
        position: { x: 450, y: 250 },
      },
    ],
    connections: [
      { from: 'node-1', to: 'node-2' },
      { from: 'node-2', to: 'node-3' },
      { from: 'node-2', to: 'node-4' },
    ],
  },
  {
    id: 'template-5',
    name: 'API Integration Hub',
    description: 'Connect multiple APIs and synchronize data across different platforms seamlessly.',
    category: 'Automation',
    icon: 'api',
    uses: 142,
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        label: 'Webhook',
        position: { x: 50, y: 100 },
      },
      {
        id: 'node-2',
        type: 'api_call',
        label: 'API 1',
        position: { x: 250, y: 50 },
      },
      {
        id: 'node-3',
        type: 'api_call',
        label: 'API 2',
        position: { x: 250, y: 150 },
      },
      {
        id: 'node-4',
        type: 'output',
        label: 'Results',
        position: { x: 450, y: 100 },
      },
    ],
    connections: [
      { from: 'node-1', to: 'node-2' },
      { from: 'node-1', to: 'node-3' },
      { from: 'node-2', to: 'node-4' },
      { from: 'node-3', to: 'node-4' },
    ],
  },
];

export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ERROR: 'error',
};

export const EXECUTION_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const API_CONFIG = {
  BASE_URL: 'https://api.openclaw.io',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};
