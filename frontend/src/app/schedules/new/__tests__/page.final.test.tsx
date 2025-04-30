import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import NewSchedulePage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../../lib/api', () => {
  return {
    scheduleApi: {
      create: jest.fn().mockResolvedValue({}),
    },
  };
});

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Server: () => <div data-testid="server-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

describe('NewSchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all required sections', () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Create New Schedule')).toBeInTheDocument();
    
    expect(screen.getByText('Cron Job')).toBeInTheDocument();
    expect(screen.getByText('API Call')).toBeInTheDocument();
    expect(screen.getByText('Owner Details')).toBeInTheDocument();
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByLabelText('Once')).toBeInTheDocument();
    expect(screen.getByLabelText('Repetitive')).toBeInTheDocument();
  });

  it('navigates between tabs correctly', async () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('API Call'));
    
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    expect(screen.getByLabelText('GET')).toBeInTheDocument();
    expect(screen.getByLabelText('POST')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Automation Request ID')).toBeInTheDocument();
    expect(screen.getByText('Target Application/Deployment')).toBeInTheDocument();
  });

  it('shows additional fields when repetitive frequency is selected', () => {
    render(<NewSchedulePage />);
    
    const repetitiveRadio = screen.getByLabelText('Repetitive');
    expect(repetitiveRadio).toBeChecked();
    
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Week of Month')).toBeInTheDocument();
    expect(screen.getByText('Month of Year')).toBeInTheDocument();
    expect(screen.getByText('Hour of Day')).toBeInTheDocument();
    expect(screen.getByText('Minute of Hour')).toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText('Once'));
    
    expect(screen.queryByText('Day of Week')).not.toBeInTheDocument();
  });

  it('shows payload field when POST method is selected', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('API Call'));
    
    const getRadio = screen.getByLabelText('GET');
    expect(getRadio).toBeChecked();
    
    expect(screen.queryByText('Payload (JSON)')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText('POST'));
    
    expect(screen.getByText('Payload (JSON)')).toBeInTheDocument();
  });

  it('shows max retries field when shouldRetry is checked', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('API Call'));
    
    const retryCheckbox = screen.getByLabelText('Retry on Failure');
    expect(retryCheckbox).not.toBeChecked();
    
    expect(screen.queryByText('Maximum Retries')).not.toBeInTheDocument();
    
    fireEvent.click(retryCheckbox);
    
    expect(screen.getByText('Maximum Retries')).toBeInTheDocument();
  });

  it('allows adding and removing contact persons', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    expect(screen.getAllByText('Contact Person').length).toBe(2);
    
    fireEvent.click(screen.getByText('Add Contact Person'));
    
    expect(screen.getAllByText('Contact Person').length).toBe(3);
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[2]);
    
    expect(screen.getAllByText('Contact Person').length).toBe(2);
    
    fireEvent.click(removeButtons[1]);
    
    expect(screen.getAllByText('Contact Person').length).toBe(2);
  });

  it('submits the form with valid data', async () => {
    const { scheduleApi } = require('../../../../lib/api');
    scheduleApi.create.mockClear();
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByLabelText('Once'));
    
    fireEvent.click(screen.getByText('API Call'));
    
    fireEvent.click(screen.getByLabelText('POST'));
    const payloadTextarea = screen.getByPlaceholderText('{"key": "value"}');
    fireEvent.change(payloadTextarea, { target: { value: '{"test": "data"}' } });
    
    const workflowInput = screen.getByPlaceholderText('workflow-id');
    fireEvent.change(workflowInput, { target: { value: 'test-workflow' } });
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const descriptionTextarea = screen.getByPlaceholderText('Describe the purpose of this schedule');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });
    
    const requestIdInput = screen.getByPlaceholderText('REQ-12345');
    fireEvent.change(requestIdInput, { target: { value: 'REQ-123' } });
    
    const targetAppInput = screen.getByPlaceholderText('Application name');
    fireEvent.change(targetAppInput, { target: { value: 'Test App' } });
    
    const nameInputs = screen.getAllByPlaceholderText('Full Name');
    const emailInputs = screen.getAllByPlaceholderText('Email Address');
    const phoneInputs = screen.getAllByPlaceholderText('Phone Number');
    
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '123-456-7890' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInputs[1], { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '098-765-4321' } });
    
    const dlInput = screen.getByPlaceholderText('Distribution List Email');
    fireEvent.change(dlInput, { target: { value: 'team@example.com' } });
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalledTimes(1);
      const callData = scheduleApi.create.mock.calls[0][0];
      
      expect(callData.frequency).toBe('once');
      expect(callData.httpMethod).toBe('POST');
      expect(callData.payload).toBe('{"test": "data"}');
      expect(callData.workflowIdentifier).toBe('test-workflow');
      expect(callData.description).toBe('Test description');
      expect(callData.automationRequestId).toBe('REQ-123');
      expect(callData.targetApplication).toBe('Test App');
      expect(callData.communicationDL).toBe('team@example.com');
      
      expect(callData.contactPersons.length).toBe(2);
      expect(callData.contactPersons[0].name).toBe('John Doe');
      expect(callData.contactPersons[0].email).toBe('john@example.com');
      expect(callData.contactPersons[0].phone).toBe('123-456-7890');
      expect(callData.contactPersons[1].name).toBe('Jane Smith');
      expect(callData.contactPersons[1].email).toBe('jane@example.com');
      expect(callData.contactPersons[1].phone).toBe('098-765-4321');
    });
  });

  it('shows loading backdrop during form submission', async () => {
    scheduleApi.create.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({}), 100);
      });
    });
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const descriptionTextarea = screen.getByPlaceholderText('Describe the purpose of this schedule');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });
    
    const requestIdInput = screen.getByPlaceholderText('REQ-12345');
    fireEvent.change(requestIdInput, { target: { value: 'REQ-123' } });
    
    const targetAppInput = screen.getByPlaceholderText('Application name');
    fireEvent.change(targetAppInput, { target: { value: 'Test App' } });
    
    const nameInputs = screen.getAllByPlaceholderText('Full Name');
    const emailInputs = screen.getAllByPlaceholderText('Email Address');
    const phoneInputs = screen.getAllByPlaceholderText('Phone Number');
    
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '123-456-7890' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInputs[1], { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '098-765-4321' } });
    
    const dlInput = screen.getByPlaceholderText('Distribution List Email');
    fireEvent.change(dlInput, { target: { value: 'team@example.com' } });
    
    fireEvent.click(screen.getByText('API Call'));
    const workflowInput = screen.getByPlaceholderText('workflow-id');
    fireEvent.change(workflowInput, { target: { value: 'test-workflow' } });
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  it('handles API errors during form submission', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    scheduleApi.create.mockRejectedValue(new Error('API Error'));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const descriptionTextarea = screen.getByPlaceholderText('Describe the purpose of this schedule');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });
    
    const requestIdInput = screen.getByPlaceholderText('REQ-12345');
    fireEvent.change(requestIdInput, { target: { value: 'REQ-123' } });
    
    const targetAppInput = screen.getByPlaceholderText('Application name');
    fireEvent.change(targetAppInput, { target: { value: 'Test App' } });
    
    const nameInputs = screen.getAllByPlaceholderText('Full Name');
    const emailInputs = screen.getAllByPlaceholderText('Email Address');
    const phoneInputs = screen.getAllByPlaceholderText('Phone Number');
    
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '123-456-7890' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInputs[1], { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '098-765-4321' } });
    
    const dlInput = screen.getByPlaceholderText('Distribution List Email');
    fireEvent.change(dlInput, { target: { value: 'team@example.com' } });
    
    fireEvent.click(screen.getByText('API Call'));
    const workflowInput = screen.getByPlaceholderText('workflow-id');
    fireEvent.change(workflowInput, { target: { value: 'test-workflow' } });
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Failed to create schedule:', expect.any(Error));
    });
    
    console.error = originalConsoleError;
  });

  it('validates form fields before submission', async () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Automation request ID is required')).toBeInTheDocument();
      expect(screen.getByText('Target application is required')).toBeInTheDocument();
      expect(screen.getByText('Communication DL is required')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('API Call'));
    
    expect(screen.getByText('Workflow identifier is required')).toBeInTheDocument();
    
    expect(scheduleApi.create).not.toHaveBeenCalled();
  });
});
