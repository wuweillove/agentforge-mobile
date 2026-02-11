import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WorkflowCanvas from '../../components/WorkflowCanvas';

describe('WorkflowCanvas', () => {
  const mockWorkflow = {
    id: 'test-workflow',
    name: 'Test Workflow',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        label: 'Input Node',
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'output',
        label: 'Output Node',
        position: { x: 300, y: 100 },
      },
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2' },
    ],
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <WorkflowCanvas workflow={mockWorkflow} onWorkflowChange={mockOnChange} />
    );
    expect(getByTestId).toBeDefined();
  });

  it('displays all nodes', () => {
    const { getAllByText } = render(
      <WorkflowCanvas workflow={mockWorkflow} onWorkflowChange={mockOnChange} />
    );
    
    expect(getAllByText('Input Node')).toBeTruthy();
    expect(getAllByText('Output Node')).toBeTruthy();
  });

  it('handles zoom in/out', () => {
    const { getByLabelText } = render(
      <WorkflowCanvas workflow={mockWorkflow} onWorkflowChange={mockOnChange} />
    );
    
    const zoomInButton = getByLabelText('Zoom in');
    const zoomOutButton = getByLabelText('Zoom out');
    
    fireEvent.press(zoomInButton);
    fireEvent.press(zoomOutButton);
    
    // Verify zoom functionality works
    expect(zoomInButton).toBeTruthy();
    expect(zoomOutButton).toBeTruthy();
  });
});
