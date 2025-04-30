import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { scheduleApi } from '../../../../lib/api';
import NewSchedulePage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../../lib/api', () => ({
  scheduleApi: {
    create: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../../../../components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="loading-backdrop" data-is-open={isOpen}>
      {isOpen && 'Processing...'}
    </div>
  ),
}));

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

  it('renders the page with correct title and tabs', () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Create New Schedule')).toBeInTheDocument();
    expect(screen.getByText('Schedule Configuration')).toBeInTheDocument();
    expect(screen.getByText('Cron Job')).toBeInTheDocument();
    expect(screen.getByText('API Call')).toBeInTheDocument();
    expect(screen.getByText('Owner Details')).toBeInTheDocument();
  });

  it('navigates between tabs when clicking tab buttons', () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('API Call'));
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Owner Details'));
    expect(screen.getByText('Description')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cron Job'));
    expect(screen.getByText('Frequency')).toBeInTheDocument();
  });

  it('navigates between tabs using Next/Back buttons', () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Next: Owner Details'));
    expect(screen.getByText('Description')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Back: API Call'));
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Back: Cron Job'));
    expect(screen.getByText('Frequency')).toBeInTheDocument();
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
    expect(screen.queryByText('Day of Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Week of Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Month of Year')).not.toBeInTheDocument();
    expect(screen.queryByText('Hour of Day')).not.toBeInTheDocument();
    expect(screen.queryByText('Minute of Hour')).not.toBeInTheDocument();
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
    
    const contactPersons = screen.getAllByText(/Contact Person \d/);
    expect(contactPersons).toHaveLength(2);
    
    fireEvent.click(screen.getByText('Add Contact Person'));
    
    const updatedContactPersons = screen.getAllByText(/Contact Person \d/);
    expect(updatedContactPersons).toHaveLength(3);
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[2]);
    
    const finalContactPersons = screen.getAllByText(/Contact Person \d/);
    expect(finalContactPersons).toHaveLength(2);
  });

  it('prevents removing contact persons when there are only two', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const contactPersons = screen.getAllByText(/Contact Person \d/);
    expect(contactPersons).toHaveLength(2);
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[1]);
    
    const updatedContactPersons = screen.getAllByText(/Contact Person \d/);
    expect(updatedContactPersons).toHaveLength(2);
  });

  it('submits the form with correct data', async () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByLabelText('Repetitive'));
    
    fireEvent.click(screen.getByText('API Call'));
    
    fireEvent.click(screen.getByLabelText('POST'));
    const payloadTextarea = screen.getByPlaceholderText('{"key": "value"}');
    fireEvent.change(payloadTextarea, { target: { value: '{"test": "data"}' } });
    
    const workflowInput = screen.getByPlaceholderText('workflow-id');
    fireEvent.change(workflowInput, { target: { value: 'test-workflow' } });
    
    fireEvent.click(screen.getByLabelText('Retry on Failure'));
    const retriesInput = screen.getByPlaceholderText('3');
    fireEvent.change(retriesInput, { target: { value: '5' } });
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const descriptionTextarea = screen.getByPlaceholderText('Describe the purpose of this schedule');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });
    
    const requestIdInput = screen.getByPlaceholderText('REQ-12345');
    fireEvent.change(requestIdInput, { target: { value: 'REQ-TEST' } });
    
    const appInput = screen.getByPlaceholderText('Application name');
    fireEvent.change(appInput, { target: { value: 'Test App' } });
    
    const nameInputs = screen.getAllByPlaceholderText('Full Name');
    const emailInputs = screen.getAllByPlaceholderText('email@example.com');
    const phoneInputs = screen.getAllByPlaceholderText('123-456-7890');
    const dlInput = screen.getByPlaceholderText('team@example.com');
    
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '111-222-3333' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInputs[1], { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '444-555-6666' } });
    
    fireEvent.change(dlInput, { target: { value: 'team@example.com' } });
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    const loadingBackdrop = screen.getByTestId('loading-backdrop');
    expect(loadingBackdrop).toHaveAttribute('data-is-open', 'true');
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalledWith(expect.objectContaining({
        frequency: 'repetitive',
        httpMethod: 'POST',
        payload: '{"test": "data"}',
        workflowIdentifier: 'test-workflow',
        shouldRetry: true,
        maxRetries: '5',
        description: 'Test description',
        automationRequestId: 'REQ-TEST',
        targetApplication: 'Test App',
        contactPersons: [
          { name: 'John Doe', email: 'john@example.com', phone: '111-222-3333' },
          { name: 'Jane Smith', email: 'jane@example.com', phone: '444-555-6666' }
        ],
        communicationDL: 'team@example.com'
      }));
    });
    
    await waitFor(() => {
      expect(loadingBackdrop).toHaveAttribute('data-is-open', 'false');
    });
  });

  it('handles form validation errors', async () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    await waitFor(() => {
      expect(screen.getByText('Workflow identifier is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Automation request ID is required')).toBeInTheDocument();
      expect(screen.getByText('Target application is required')).toBeInTheDocument();
      expect(screen.getByText('Communication DL is required')).toBeInTheDocument();
    });
  });

  it('handles API errors during form submission', async () => {
    (scheduleApi.create as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('API Call'));
    
    const workflowInput = screen.getByPlaceholderText('workflow-id');
    fireEvent.change(workflowInput, { target: { value: 'test-workflow' } });
    
    fireEvent.click(screen.getByText('Owner Details'));
    
    const descriptionTextarea = screen.getByPlaceholderText('Describe the purpose of this schedule');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });
    
    const requestIdInput = screen.getByPlaceholderText('REQ-12345');
    fireEvent.change(requestIdInput, { target: { value: 'REQ-TEST' } });
    
    const appInput = screen.getByPlaceholderText('Application name');
    fireEvent.change(appInput, { target: { value: 'Test App' } });
    
    const nameInputs = screen.getAllByPlaceholderText('Full Name');
    const emailInputs = screen.getAllByPlaceholderText('email@example.com');
    const phoneInputs = screen.getAllByPlaceholderText('123-456-7890');
    const dlInput = screen.getByPlaceholderText('team@example.com');
    
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '111-222-3333' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInputs[1], { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '444-555-6666' } });
    
    fireEvent.change(dlInput, { target: { value: 'team@example.com' } });
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    const loadingBackdrop = screen.getByTestId('loading-backdrop');
    expect(loadingBackdrop).toHaveAttribute('data-is-open', 'true');
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to create schedule:', expect.any(Error));
    });
    
    await waitFor(() => {
      expect(loadingBackdrop).toHaveAttribute('data-is-open', 'false');
    });
  });
});
