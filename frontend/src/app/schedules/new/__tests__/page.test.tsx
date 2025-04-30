import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewSchedulePage from '../page';
import { scheduleApi } from '@/lib/api';
import userEvent from '@testing-library/user-event';

jest.mock('@/lib/api', () => ({
  scheduleApi: {
    create: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Server: () => <div data-testid="server-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useForm: () => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'GET';
        if (field === 'shouldRetry') return false;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }),
  };
});

describe('NewSchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the page title', () => {
    render(<NewSchedulePage />);
    expect(screen.getByText('Create New Schedule')).toBeInTheDocument();
  });

  it('should render the form tabs', () => {
    render(<NewSchedulePage />);
    expect(screen.getByText('Cron Job')).toBeInTheDocument();
    expect(screen.getByText('API Call')).toBeInTheDocument();
    expect(screen.getByText('Owner Details')).toBeInTheDocument();
  });

  it('should render the frequency options in the Cron Job tab', () => {
    render(<NewSchedulePage />);
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('Once')).toBeInTheDocument();
    expect(screen.getByText('Repetitive')).toBeInTheDocument();
    
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Week of Month')).toBeInTheDocument();
    expect(screen.getByText('Month of Year')).toBeInTheDocument();
    expect(screen.getByText('Hour of Day')).toBeInTheDocument();
    expect(screen.getByText('Minute of Hour')).toBeInTheDocument();
  });

  it('should navigate to API Call tab when clicking Next button', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('Workflow Identifier')).toBeInTheDocument();
    expect(screen.getByText('Retry on Failure')).toBeInTheDocument();
  });

  it('should navigate to Owner Details tab when clicking Next button from API Call tab', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Automation Request ID')).toBeInTheDocument();
    expect(screen.getByText('Target Application/Deployment')).toBeInTheDocument();
    expect(screen.getByText('Contact Persons')).toBeInTheDocument();
    expect(screen.getByText('Communication DL')).toBeInTheDocument();
  });

  it('should navigate back to previous tabs', () => {
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    fireEvent.click(screen.getByText('Back: API Call'));
    
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Back: Cron Job'));
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
  });

  it('should show payload field when POST method is selected', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'POST';
        if (field === 'shouldRetry') return false;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    expect(screen.getByText('Payload (JSON)')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid JSON object to be used as the payload for the POST call.')).toBeInTheDocument();
  });

  it('should show max retries field when shouldRetry is checked', () => {
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
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    expect(screen.getByText('Maximum Retries')).toBeInTheDocument();
    expect(screen.getByText('How many times should the API call be retried before giving up?')).toBeInTheDocument();
  });

  it('should handle adding and removing contact persons', () => {
    const mockContactPersons = [
      { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
    ];
    
    jest.spyOn(React, 'useState').mockImplementation(() => {
      return [mockContactPersons, jest.fn()];
    });
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    expect(screen.getByText('Contact Persons')).toBeInTheDocument();
    expect(screen.getByText('Add Contact Person')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Add Contact Person'));
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
  });

  it('should handle form submission', async () => {
    const mockPush = jest.fn();
    (require('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
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
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'GET';
        if (field === 'shouldRetry') return false;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should handle form submission errors', async () => {
    (scheduleApi.create as jest.Mock).mockRejectedValue(new Error('API Error'));
    
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
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'GET';
        if (field === 'shouldRetry') return false;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
    
    expect(console.error).toHaveBeenCalled();
  });

  it('should show loading backdrop during form submission', async () => {
    const mockHandleSubmit = jest.fn((callback) => {
      return (e: React.FormEvent) => {
        e.preventDefault();
        callback({});
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
    
    const mockSetIsSubmitting = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => {
      // Return true for isSubmitting
      return [true, mockSetIsSubmitting];
    });
    
    render(<NewSchedulePage />);
    
    const backdrop = document.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
  });
});

describe('NewSchedulePage Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display validation errors when form is submitted with invalid data', async () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { 
        errors: {
          workflowIdentifier: { message: 'Workflow identifier is required' },
          description: { message: 'Description is required' },
          contactPersons: { message: 'At least two contact persons are required' }
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
    expect(screen.getByText('At least two contact persons are required')).toBeInTheDocument();
  });

  it('should hide cron job options when frequency is set to once', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'once';
        if (field === 'httpMethod') return 'GET';
        if (field === 'shouldRetry') return false;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    expect(screen.queryByText('Day of Week')).not.toBeInTheDocument();
    expect(screen.queryByText('Day of Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Week of Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Month of Year')).not.toBeInTheDocument();
    expect(screen.queryByText('Hour of Day')).not.toBeInTheDocument();
    expect(screen.queryByText('Minute of Hour')).not.toBeInTheDocument();
  });

  it('should validate JSON in payload field', () => {
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { 
        errors: {
          payload: { message: 'Invalid JSON format' }
        } 
      },
      control: { register: jest.fn() },
      watch: jest.fn((field) => {
        if (field === 'frequency') return 'repetitive';
        if (field === 'httpMethod') return 'POST';
        if (field === 'shouldRetry') return false;
        return null;
      }),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    
    expect(screen.getByText('Payload (JSON)')).toBeInTheDocument();
    
    expect(screen.getByText('Invalid JSON format')).toBeInTheDocument();
  });

  it('should validate contact person fields', () => {
    const mockContactPersons = [
      { name: "", email: "invalid-email", phone: "" },
      { name: "", email: "", phone: "" },
    ];
    
    jest.spyOn(React, 'useState').mockImplementation(() => {
      return [mockContactPersons, jest.fn()];
    });
    
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { 
        errors: {
          contactPersons: [
            { 
              name: { message: 'Name is required' },
              email: { message: 'Invalid email address' },
              phone: { message: 'Phone number is required' }
            },
            {
              name: { message: 'Name is required' },
              email: { message: 'Email is required' },
              phone: { message: 'Phone number is required' }
            }
          ]
        } 
      },
      control: { register: jest.fn() },
      watch: jest.fn(() => null),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }));
    
    render(<NewSchedulePage />);
    
    fireEvent.click(screen.getByText('Next: API Call Details'));
    fireEvent.click(screen.getByText('Next: Owner Details'));
    
    expect(screen.getAllByText('Name is required').length).toBeGreaterThan(0);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getAllByText('Phone number is required').length).toBeGreaterThan(0);
  });

  it('should show loading backdrop during form submission and handle success', async () => {
    const mockPush = jest.fn();
    (require('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    const mockSetState = jest.fn();
    jest.spyOn(React, 'useState')
      .mockReturnValueOnce(['owner', jest.fn()])
      // Second call for isSubmitting
      .mockReturnValueOnce([true, mockSetState])
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
        
        setTimeout(() => {
          mockSetState(false);
        }, 0);
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
    
    (scheduleApi.create as jest.Mock).mockResolvedValue({});
    
    render(<NewSchedulePage />);
    
    const backdrop = document.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Create Schedule'));
    
    await waitFor(() => {
      expect(scheduleApi.create).toHaveBeenCalled();
    });
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
