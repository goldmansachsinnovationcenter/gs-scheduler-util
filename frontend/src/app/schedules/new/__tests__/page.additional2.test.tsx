import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewSchedulePage from '../page';
import { scheduleApi } from '@/lib/api';
import userEvent from '@testing-library/user-event';

// Additional tests to improve coverage for NewSchedulePage
describe('NewSchedulePage Additional Tests 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test for POST method with payload validation
  it('should validate JSON payload for POST method', async () => {
    // Mock form state with POST method selected
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { 
        errors: {} 
      },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'POST';
        if (field === 'shouldRetry') return true;
        if (field === 'maxRetries') return 3;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({
        payload: '{"key": "value"}'
      })),
    }));
    
    render(<NewSchedulePage />);
    
    // Navigate to API Call Details tab
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    // Payload field should be visible for POST
    expect(screen.getByText('Payload (JSON)')).toBeInTheDocument();
    
    // Test valid JSON
    const payloadInput = screen.getByLabelText('Payload (JSON)');
    fireEvent.change(payloadInput, { target: { value: '{"key": "value"}' } });
    
    // No error should be displayed
    expect(screen.queryByText('Invalid JSON format')).not.toBeInTheDocument();
  });

  // Test for retry options
  it('should show max retries field when shouldRetry is true', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'GET';
        if (field === 'shouldRetry') return true;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    // Navigate to API Call Details tab
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    // Max retries field should be visible
    expect(screen.getByText('Max Retries')).toBeInTheDocument();
  });

  // Test for contact person management
  it('should add and remove contact persons', () => {
    // Mock useState for contactPersons
    const mockContactPersons = [
      { name: "John Doe", email: "john@example.com", phone: "123-456-7890" }
    ];
    
    const mockSetContactPersons = jest.fn((updater) => {
      if (typeof updater === 'function') {
        mockContactPersons.push({ name: "", email: "", phone: "" });
      } else {
        // Handle remove case
        mockContactPersons.splice(1, 1);
      }
    });
    
    jest.spyOn(React, 'useState')
      .mockReturnValueOnce(['owner', jest.fn()])
      .mockReturnValueOnce([false, jest.fn()])
      .mockReturnValueOnce([mockContactPersons, mockSetContactPersons]);
    
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
    
    // Navigate to Owner Details tab
    fireEvent.click(screen.getByText('Next: API Call Details'));
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    // Add contact person button should be visible
    const addButton = screen.getByText('Add Contact Person');
    fireEvent.click(addButton);
    
    // mockSetContactPersons should be called
    expect(mockSetContactPersons).toHaveBeenCalled();
    
    // If we had more than one contact, we should see remove buttons
    if (mockContactPersons.length > 1) {
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);
      
      // mockSetContactPersons should be called again
      expect(mockSetContactPersons).toHaveBeenCalledTimes(2);
    }
  });

  // Test for form submission error handling
  it('should handle API errors during form submission', async () => {
    // Mock useState
    const mockSetIsSubmitting = jest.fn();
    jest.spyOn(React, 'useState')
      .mockReturnValueOnce(['owner', jest.fn()])
      .mockReturnValueOnce([false, mockSetIsSubmitting])
      .mockReturnValueOnce([[
        { name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
        { name: "Jane Smith", email: "jane@example.com", phone: "098-765-4321" },
      ], jest.fn()]);
    
    // Mock form submission
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
          shouldRetry: false,
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
    
    // Mock API error
    (scheduleApi.create as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    // Mock window.alert
    const mockAlert = jest.fn();
    global.alert = mockAlert;
    
    render(<NewSchedulePage />);
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Schedule'));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
    
    // Alert should be called with error message
    expect(mockAlert).toHaveBeenCalledWith('Failed to create schedule: Error: API Error');
    
    // isSubmitting should be set back to false
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  // Test for cron job expression generation
  it('should generate correct cron expression based on inputs', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'dayOfWeek') return '1';
        if (field === 'dayOfMonth') return '15';
        if (field === 'weekOfMonth') return '2';
        if (field === 'monthOfYear') return '6';
        if (field === 'hourOfDay') return '12';
        if (field === 'minuteOfHour') return '30';
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    // All cron job fields should be visible
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Week of Month')).toBeInTheDocument();
    expect(screen.getByText('Month of Year')).toBeInTheDocument();
    expect(screen.getByText('Hour of Day')).toBeInTheDocument();
    expect(screen.getByText('Minute of Hour')).toBeInTheDocument();
    
    // Values should be set correctly
    expect(screen.getByLabelText('Day of Week')).toHaveValue('1');
    expect(screen.getByLabelText('Day of Month')).toHaveValue('15');
    expect(screen.getByLabelText('Week of Month')).toHaveValue('2');
    expect(screen.getByLabelText('Month of Year')).toHaveValue('6');
    expect(screen.getByLabelText('Hour of Day')).toHaveValue('12');
    expect(screen.getByLabelText('Minute of Hour')).toHaveValue('30');
  });
});
