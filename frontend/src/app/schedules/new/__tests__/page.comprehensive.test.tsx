import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewSchedulePage from '../page';
import { scheduleApi } from '../../../../lib/api';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('../../../../lib/api', () => ({
  scheduleApi: {
    create: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

jest.mock('../../../../components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="loading-backdrop" data-is-open={isOpen}>
      {isOpen && 'Processing...'}
    </div>
  ),
}));

describe('NewSchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (scheduleApi.create as jest.Mock).mockResolvedValue({
      data: { id: '123' },
    });
  });

  it('should render the page title', () => {
    render(<NewSchedulePage />);
    expect(screen.getByText('Create New API Schedule')).toBeInTheDocument();
  });

  it('should render all form sections', () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Cron Job Expression')).toBeInTheDocument();
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    
    expect(screen.getByText('API Call Details')).toBeInTheDocument();
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    expect(screen.getByText('Workflow Identifier')).toBeInTheDocument();
    
    expect(screen.getByText('Schedule Owner Details')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Target Application')).toBeInTheDocument();
  });

  it('should toggle frequency options when selecting once or repetitive', () => {
    render(<NewSchedulePage />);
    
    const onceRadio = screen.getByLabelText('Once');
    const repetitiveRadio = screen.getByLabelText('Repetitive');
    
    expect(onceRadio).toBeChecked();
    expect(repetitiveRadio).not.toBeChecked();
    
    expect(screen.getByText('Execution Date')).toBeInTheDocument();
    expect(screen.getByText('Execution Time')).toBeInTheDocument();
    
    fireEvent.click(repetitiveRadio);
    
    expect(onceRadio).not.toBeChecked();
    expect(repetitiveRadio).toBeChecked();
    
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Hour')).toBeInTheDocument();
    expect(screen.getByText('Minute')).toBeInTheDocument();
  });

  it('should toggle payload field when selecting POST method', () => {
    render(<NewSchedulePage />);
    
    const getRadio = screen.getByLabelText('GET');
    const postRadio = screen.getByLabelText('POST');
    
    expect(getRadio).toBeChecked();
    expect(postRadio).not.toBeChecked();
    
    expect(screen.queryByText('Payload (JSON)')).not.toBeInTheDocument();
    
    fireEvent.click(postRadio);
    
    expect(getRadio).not.toBeChecked();
    expect(postRadio).toBeChecked();
    
    expect(screen.getByText('Payload (JSON)')).toBeInTheDocument();
  });

  it('should toggle retry options when selecting should retry', () => {
    render(<NewSchedulePage />);
    
    const retrySwitch = screen.getByLabelText('Should Retry on Failure');
    
    expect(retrySwitch).not.toBeChecked();
    
    expect(screen.queryByText('Max Retries')).not.toBeInTheDocument();
    
    fireEvent.click(retrySwitch);
    
    expect(screen.getByText('Max Retries')).toBeInTheDocument();
  });

  it('should allow adding and removing contact persons', () => {
    render(<NewSchedulePage />);
    
    const nameInputs = screen.getAllByLabelText(/Contact Person Name/);
    expect(nameInputs.length).toBe(2);
    
    const addButton = screen.getByText('Add Contact Person');
    fireEvent.click(addButton);
    
    const updatedNameInputs = screen.getAllByLabelText(/Contact Person Name/);
    expect(updatedNameInputs.length).toBe(3);
    
    const removeButtons = screen.getAllByTestId('minus-icon');
    fireEvent.click(removeButtons[0]);
    
    const finalNameInputs = screen.getAllByLabelText(/Contact Person Name/);
    expect(finalNameInputs.length).toBe(2);
  });

  it('should show validation errors when submitting an empty form', async () => {
    render(<NewSchedulePage />);
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Target application is required')).toBeInTheDocument();
      expect(screen.getByText('Workflow identifier is required')).toBeInTheDocument();
      expect(screen.getByText('Communication DL is required')).toBeInTheDocument();
      expect(screen.getByText('Automation request ID is required')).toBeInTheDocument();
    });
    
    expect(scheduleApi.create).not.toHaveBeenCalled();
  });

  it('should submit the form successfully when all fields are valid', async () => {
    render(<NewSchedulePage />);
    
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Schedule' } });
    fireEvent.change(screen.getByLabelText('Target Application'), { target: { value: 'Test App' } });
    fireEvent.change(screen.getByLabelText('Workflow Identifier'), { target: { value: 'test-workflow' } });
    fireEvent.change(screen.getByLabelText('Communication DL'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Automation Request ID'), { target: { value: 'AUTO-123' } });
    
    const nameInputs = screen.getAllByLabelText(/Contact Person Name/);
    const emailInputs = screen.getAllByLabelText(/Contact Person Email/);
    const phoneInputs = screen.getAllByLabelText(/Contact Person Phone/);
    
    fireEvent.change(nameInputs[0], { target: { value: 'Test Person 1' } });
    fireEvent.change(emailInputs[0], { target: { value: 'test1@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '123-456-7890' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Test Person 2' } });
    fireEvent.change(emailInputs[1], { target: { value: 'test2@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '098-765-4321' } });
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('loading-backdrop')).toHaveAttribute('data-is-open', 'true');
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Schedule',
        targetApplication: 'Test App',
        workflowIdentifier: 'test-workflow',
        communicationDL: 'test@example.com',
        automationRequestId: 'AUTO-123',
        contactPersons: [
          { name: 'Test Person 1', email: 'test1@example.com', phone: '123-456-7890' },
          { name: 'Test Person 2', email: 'test2@example.com', phone: '098-765-4321' }
        ]
      }));
    });
    
    const mockPush = (require('next/navigation') as any).useRouter().push;
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/analytics');
    });
  });

  it('should handle API error gracefully', async () => {
    (scheduleApi.create as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<NewSchedulePage />);
    
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Schedule' } });
    fireEvent.change(screen.getByLabelText('Target Application'), { target: { value: 'Test App' } });
    fireEvent.change(screen.getByLabelText('Workflow Identifier'), { target: { value: 'test-workflow' } });
    fireEvent.change(screen.getByLabelText('Communication DL'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Automation Request ID'), { target: { value: 'AUTO-123' } });
    
    const nameInputs = screen.getAllByLabelText(/Contact Person Name/);
    const emailInputs = screen.getAllByLabelText(/Contact Person Email/);
    const phoneInputs = screen.getAllByLabelText(/Contact Person Phone/);
    
    fireEvent.change(nameInputs[0], { target: { value: 'Test Person 1' } });
    fireEvent.change(emailInputs[0], { target: { value: 'test1@example.com' } });
    fireEvent.change(phoneInputs[0], { target: { value: '123-456-7890' } });
    
    fireEvent.change(nameInputs[1], { target: { value: 'Test Person 2' } });
    fireEvent.change(emailInputs[1], { target: { value: 'test2@example.com' } });
    fireEvent.change(phoneInputs[1], { target: { value: '098-765-4321' } });
    
    const submitButton = screen.getByText('Create Schedule');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to create schedule')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('loading-backdrop')).toHaveAttribute('data-is-open', 'false');
  });

  it('should navigate back when cancel button is clicked', () => {
    const mockBack = jest.fn();
    (require('next/navigation') as any).useRouter = () => ({
      push: jest.fn(),
      back: mockBack,
    });
    
    render(<NewSchedulePage />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockBack).toHaveBeenCalled();
  });
});
