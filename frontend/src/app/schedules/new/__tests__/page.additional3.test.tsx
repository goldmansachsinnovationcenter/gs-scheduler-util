import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewSchedulePage from '../page';
import { scheduleApi } from '../../../../lib/api';
import userEvent from '@testing-library/user-event';

describe('NewSchedulePage Additional Tests 3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display validation errors for required fields', async () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { 
        errors: {
          workflowIdentifier: { message: 'Workflow identifier is required' },
          description: { message: 'Description is required' },
          targetApplication: { message: 'Target application is required' },
          communicationDL: { message: 'Communication DL is required' }
        } 
      },
      control: { register: jest.fn() },
      watch: jest.fn(() => null),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    expect(screen.getByText('Workflow identifier is required')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Target application is required')).toBeInTheDocument();
    expect(screen.getByText('Communication DL is required')).toBeInTheDocument();
  });

  it('should handle once frequency option', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'once';
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Execution Date')).toBeInTheDocument();
    expect(screen.getByText('Execution Time')).toBeInTheDocument();
    
    expect(screen.queryByText('Day of Week')).not.toBeInTheDocument();
    expect(screen.queryByText('Day of Month')).not.toBeInTheDocument();
  });

  it('should navigate between tabs correctly', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn(() => null),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Cron Job Expression')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    expect(screen.getByText('API Call Details')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Next: Owner Details'));
    expect(screen.getByText('Owner Details')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Back: API Call Details'));
    expect(screen.getByText('API Call Details')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Back: Cron Job'));
    expect(screen.getByText('Cron Job Expression')).toBeInTheDocument();
  });

  it('should handle successful form submission', async () => {
    const mockSetIsSubmitting = jest.fn();
    const mockSetActiveTab = jest.fn();
    
    jest.spyOn(React, 'useState')
      .mockReturnValueOnce(['cronJob', mockSetActiveTab])
      .mockReturnValueOnce([false, mockSetIsSubmitting])
      .mockReturnValueOnce([[
        { name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
        { name: "Jane Smith", email: "jane@example.com", phone: "098-765-4321" },
      ], jest.fn()]);
    
    const mockHandleSubmit = jest.fn((callback) => {
      return (e: React.FormEvent) => {
        e.preventDefault();
        callback({
          frequency: 'repetitive',
          dayOfWeek: '1',
          dayOfMonth: '1',
          weekOfMonth: '1',
          monthOfYear: '1',
          hourOfDay: '0',
          minuteOfHour: '0',
          httpMethod: 'GET',
          workflowIdentifier: 'test-workflow',
          shouldRetry: true,
          maxRetries: 3,
          description: 'Test description',
          automationRequestId: 'REQ-123',
          targetApplication: 'Test App',
          contactPersons: [
            { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
            { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
          ],
          communicationDL: 'test@example.com',
        });
      };
    });
    
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn(() => null),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    (scheduleApi.create as jest.Mock).mockResolvedValue({ 
      data: { id: '123', message: 'Schedule created successfully' } 
    });
    
    const mockAlert = jest.fn();
    global.alert = mockAlert;
    
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    });
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
    
    expect(mockAlert).toHaveBeenCalledWith('Schedule created successfully!');
    
    expect(mockPush).toHaveBeenCalledWith('/analytics');
    
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });
});
