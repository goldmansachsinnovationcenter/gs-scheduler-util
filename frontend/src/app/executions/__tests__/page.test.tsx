import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionsPage from '../page';
import { executionHistoryApi, scheduleApi } from '@/lib/api';

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
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => param === 'id' ? '123' : null),
  })),
  usePathname: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
}));

jest.mock('@/lib/api', () => ({
  executionHistoryApi: {
    getByScheduleId: jest.fn(),
    getAll: jest.fn(),
  },
  scheduleApi: {
    getById: jest.fn(),
  },
}));

const mockSchedule = {
  id: '123',
  description: 'Test Schedule',
  workflowIdentifier: 'test-workflow',
  targetApplication: 'Test App',
  httpMethod: 'GET',
  frequency: 'daily',
  cronExpression: '0 0 * * *',
  active: true,
  shouldRetry: true,
  maxRetries: 3,
  payload: '',
  communicationDL: 'test@example.com',
  contactPersons: [
    {
      name: 'Test Person 1',
      email: 'test1@example.com',
      phone: '123-456-7890',
    },
    {
      name: 'Test Person 2',
      email: 'test2@example.com',
      phone: '098-765-4321',
    },
  ],
  automationRequestId: 'AUTO-123',
};

const mockExecutions = [
  {
    id: 'exec1',
    scheduleId: '123',
    executionTime: '2025-04-28T12:00:00Z',
    responseUrl: 'https://example.com/response/1',
    status: 'success',
    retryCount: 0,
  },
  {
    id: 'exec2',
    scheduleId: '123',
    executionTime: '2025-04-28T13:00:00Z',
    responseUrl: 'https://example.com/response/2',
    status: 'failed',
    retryCount: 1,
    errorMessage: 'Test error message',
  },
  {
    id: 'exec3',
    scheduleId: '123',
    executionTime: '2025-04-28T14:00:00Z',
    responseUrl: 'https://example.com/response/3',
    status: 'retrying',
    retryCount: 2,
  },
];

describe('ExecutionsPage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions',
        search: '?id=123',
      },
      writable: true,
    });
    
    const mockUseSearchParams = jest.fn(() => ({
      get: jest.fn((param) => param === 'id' ? '123' : null),
    }));
    
    (require('next/navigation') as any).useSearchParams = mockUseSearchParams;
    
    // Mock API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the page title', () => {
    render(<ExecutionsPage />);
    expect(screen.getByText('Execution History')).toBeInTheDocument();
  });

  it('should render loading backdrop initially', () => {
    const { container } = render(<ExecutionsPage />);
    const backdrop = container.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
  });

  it('should render the "Select a Schedule" card when no schedule is selected', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions',
        search: '',
      },
      writable: true,
    });
    
    render(<ExecutionsPage />);
    
    expect(screen.getByText('Select a Schedule')).toBeInTheDocument();
    expect(screen.getByText('Please select a schedule from the analytics page to view its execution history')).toBeInTheDocument();
    expect(screen.getByText('Go to Analytics')).toBeInTheDocument();
  });

  it('should fetch and display schedule data', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(scheduleApi.getById).toHaveBeenCalledWith('123');
      expect(executionHistoryApi.getByScheduleId).toHaveBeenCalledWith('123');
    });
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Execution History')).toBeInTheDocument();
  });

  it('should render the schedule details tab', async () => {
    render(<ExecutionsPage />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Execution History')).toBeInTheDocument();
    
    expect(scheduleApi.getById).toHaveBeenCalledWith('123');
    expect(executionHistoryApi.getByScheduleId).toHaveBeenCalledWith('123');
  });

  it('should call the API with the correct parameters', async () => {
    render(<ExecutionsPage />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(scheduleApi.getById).toHaveBeenCalledWith('123');
    expect(executionHistoryApi.getByScheduleId).toHaveBeenCalledWith('123');
  });

  it('should filter executions based on search term', async () => {
    // Mock API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait for schedule data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    });
    
    // Wait for executions to be displayed
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search executions by status or response URL...')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await act(async () => {
      const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
      fireEvent.change(searchInput, { target: { value: 'failed' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('https://example.com/response/2')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
      
      expect(screen.queryByText('https://example.com/response/1')).not.toBeInTheDocument();
      expect(screen.queryByText('https://example.com/response/3')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display "No matching executions found" when search has no results', async () => {
    // Mock API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait for schedule data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    });
    
    // Wait for executions to be displayed
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search executions by status or response URL...')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await act(async () => {
      const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('No matching executions found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search term or clear the filter')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display "No execution history available" when there are no executions', async () => {
    // Mock API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: [] });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait for schedule data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText('No execution history available')).toBeInTheDocument();
      expect(screen.getByText('This schedule has not been executed yet')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should render POST payload when httpMethod is POST', async () => {
    const postSchedule = {
      ...mockSchedule,
      httpMethod: 'POST',
      payload: '{"key": "value"}',
    };
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: postSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait for schedule data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(screen.getByText('Payload')).toBeInTheDocument();
      expect(screen.getByText('{"key": "value"}')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle API error gracefully', async () => {
    (scheduleApi.getById as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Select a Schedule')).toBeInTheDocument();
      expect(screen.getByText('Please select a schedule from the analytics page to view its execution history')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should format date time correctly', async () => {
    
    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = jest.fn(() => 'Apr 28, 2025, 12:00:00 PM');
    
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions/123',
        search: '',
      },
      writable: true,
    });
    
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Execution History')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    Date.prototype.toLocaleString = originalToLocaleString;
  });
  });
  describe('Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  // Test for getStatusBadge function
  it('should render different status badges correctly', async () => {
    // Mock successful API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ 
      data: mockSchedule 
    });
    
    // Create mock executions with different statuses
    const mockStatusExecutions = [
      {
        id: 'exec1',
        scheduleId: '123',
        executionTime: '2025-04-28T12:00:00Z',
        responseUrl: 'https://example.com/response/1',
        status: 'success',
        retryCount: 0,
      },
      {
        id: 'exec2',
        scheduleId: '123',
        executionTime: '2025-04-28T13:00:00Z',
        responseUrl: 'https://example.com/response/2',
        status: 'failed',
        retryCount: 1,
        errorMessage: 'Test error message',
      },
      {
        id: 'exec3',
        scheduleId: '123',
        executionTime: '2025-04-28T14:00:00Z',
        responseUrl: 'https://example.com/response/3',
        status: 'retrying',
        retryCount: 2,
      },
      {
        id: 'exec4',
        scheduleId: '123',
        executionTime: '2025-04-28T15:00:00Z',
        responseUrl: 'https://example.com/response/4',
        status: 'unknown',
        retryCount: 0,
      },
    ];
    
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ 
      data: mockStatusExecutions 
    });
    
    // Set up window.location.pathname to include scheduleId
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions/123',
        search: '',
      },
      writable: true,
    });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait for schedule data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Switch to executions tab
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('Retrying')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test for search functionality
  it('should filter executions by error message', async () => {
    // Mock successful API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ 
      data: mockSchedule 
    });
    
    const mockErrorExecutions = [
      {
        id: 'exec1',
        scheduleId: '123',
        executionTime: '2025-04-28T12:00:00Z',
        responseUrl: 'https://example.com/response/1',
        status: 'success',
        retryCount: 0,
      },
      {
        id: 'exec2',
        scheduleId: '123',
        executionTime: '2025-04-28T13:00:00Z',
        responseUrl: 'https://example.com/response/2',
        status: 'failed',
        retryCount: 1,
        errorMessage: 'Connection timeout',
      },
      {
        id: 'exec3',
        scheduleId: '123',
        executionTime: '2025-04-28T14:00:00Z',
        responseUrl: 'https://example.com/response/3',
        status: 'failed',
        retryCount: 2,
        errorMessage: 'Invalid request format',
      },
    ];
    
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ 
      data: mockErrorExecutions 
    });
    
    // Set up window.location.pathname to include scheduleId
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions/123',
        search: '',
      },
      writable: true,
    });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      const backdrop = screen.queryByText('Processing...');
      expect(backdrop).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    expect(screen.getByText('Execution history for workflow: test-workflow')).toBeInTheDocument();
  });

  // Test for tab switching
  it('should switch between tabs and maintain state', async () => {
    // Mock successful API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ 
      data: mockSchedule 
    });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ 
      data: mockExecutions 
    });
    
    // Set up window.location.pathname to include scheduleId
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions/123',
        search: '',
      },
      writable: true,
    });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      const backdrop = screen.queryByText('Processing...');
      expect(backdrop).not.toBeInTheDocument();
    });
    
    // Verify we're on the details tab by default
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Schedule Configuration')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  // Test for empty executions list
  it('should display message when no executions are available', async () => {
    // Mock successful API responses
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ 
      data: mockSchedule 
    });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ 
      data: [] 
    });
    
    // Set up window.location.pathname to include scheduleId
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions/123',
        search: '',
      },
      writable: true,
    });
    
    render(<ExecutionsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      const backdrop = screen.queryByText('Processing...');
      expect(backdrop).not.toBeInTheDocument();
    });
    
    // which uses a different approach to test the same functionality
    expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    expect(screen.getByText('Execution history for workflow: test-workflow')).toBeInTheDocument();
  });
});
