import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionsPage from '../page';
import { scheduleApi, executionHistoryApi } from '../../../lib/api';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation((param) => {
      if (param === 'id') return '123';
      return null;
    }),
  }),
}));

jest.mock('../../../lib/api', () => ({
  scheduleApi: {
    getById: jest.fn(),
  },
  executionHistoryApi: {
    getByScheduleId: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

jest.mock('../../../components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="loading-backdrop" data-is-open={isOpen}>
      {isOpen && 'Processing...'}
    </div>
  ),
}));

describe('ExecutionsPage', () => {
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
    payload: '{"test": "data"}',
    communicationDL: 'test@example.com',
    contactPersons: [
      { name: 'Test Person 1', email: 'test1@example.com', phone: '123-456-7890' },
      { name: 'Test Person 2', email: 'test2@example.com', phone: '098-765-4321' }
    ],
    automationRequestId: 'AUTO-123'
  };

  const mockExecutions = [
    {
      id: '1',
      scheduleId: '123',
      executionTime: '2023-01-01T00:00:00Z',
      responseUrl: 'https://example.com/response/1',
      status: 'SUCCESS',
      retryCount: 0,
      errorMessage: null
    },
    {
      id: '2',
      scheduleId: '123',
      executionTime: '2023-01-02T00:00:00Z',
      responseUrl: 'https://example.com/response/2',
      status: 'FAILED',
      retryCount: 1,
      errorMessage: 'Test error message'
    },
    {
      id: '3',
      scheduleId: '123',
      executionTime: '2023-01-03T00:00:00Z',
      responseUrl: 'https://example.com/response/3',
      status: 'RETRYING',
      retryCount: 2,
      errorMessage: 'Retrying...'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions/123',
      },
      writable: true,
    });

    (scheduleApi.getById as jest.Mock).mockResolvedValue({
      data: mockSchedule
    });
    
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({
      data: mockExecutions
    });
  });

  it('should render the loading state initially', async () => {
    render(<ExecutionsPage />);
    
    const loadingBackdrop = screen.getByTestId('loading-backdrop');
    expect(loadingBackdrop).toBeInTheDocument();
    expect(loadingBackdrop).toHaveAttribute('data-is-open', 'true');
    
    await waitFor(() => {
      expect(loadingBackdrop).toHaveAttribute('data-is-open', 'false');
    });
  });

  it('should fetch and display schedule data', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(scheduleApi.getById).toHaveBeenCalledWith('123');
      expect(executionHistoryApi.getByScheduleId).toHaveBeenCalledWith('123');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Execution history for workflow: test-workflow/i)).toBeInTheDocument();
    });
  });

  it('should display schedule details tab content', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    });
    
    const detailsTab = screen.getByText('Schedule Details');
    expect(detailsTab).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Target Application:')).toBeInTheDocument();
      expect(screen.getByText('Test App')).toBeInTheDocument();
      expect(screen.getByText('HTTP Method:')).toBeInTheDocument();
      expect(screen.getByText('GET')).toBeInTheDocument();
      expect(screen.getByText('Workflow ID:')).toBeInTheDocument();
      expect(screen.getByText('test-workflow')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Contact Person 1')).toBeInTheDocument();
      expect(screen.getByText('Test Person 1')).toBeInTheDocument();
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    });
  });

  it('should switch to executions tab and display execution history', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    });
    
    const executionsTab = screen.getByRole('tab', { name: 'Execution History' });
    fireEvent.click(executionsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Execution Time')).toBeInTheDocument();
      expect(screen.getByText('Response URL')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Retry Count')).toBeInTheDocument();
      expect(screen.getByText('Error Message')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('https://example.com/response/1')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/response/2')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/response/3')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      const successBadge = screen.getByText('Success');
      const failedBadge = screen.getByText('Failed');
      const retryingBadge = screen.getByText('Retrying');
      
      expect(successBadge).toBeInTheDocument();
      expect(failedBadge).toBeInTheDocument();
      expect(retryingBadge).toBeInTheDocument();
    });
  });

  it('should filter executions based on search term', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    });
    
    const executionsTab = screen.getByRole('tab', { name: 'Execution History' });
    fireEvent.click(executionsTab);
    
    await waitFor(() => {
      expect(screen.getByText('https://example.com/response/1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
    fireEvent.change(searchInput, { target: { value: 'failed' } });
    
    await waitFor(() => {
      expect(screen.queryByText('https://example.com/response/1')).not.toBeInTheDocument();
      expect(screen.getByText('https://example.com/response/2')).toBeInTheDocument();
      expect(screen.queryByText('https://example.com/response/3')).not.toBeInTheDocument();
    });
  });

  it('should display empty state when no executions match search', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    });
    
    const executionsTab = screen.getByRole('tab', { name: 'Execution History' });
    fireEvent.click(executionsTab);
    
    await waitFor(() => {
      expect(screen.getByText('https://example.com/response/1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No matching executions found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search term or clear the filter')).toBeInTheDocument();
    });
  });

  it('should display fallback UI when no schedule is found', async () => {
    (scheduleApi.getById as jest.Mock).mockResolvedValue({
      data: null
    });
    
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      const loadingBackdrop = screen.getByTestId('loading-backdrop');
      expect(loadingBackdrop).toHaveAttribute('data-is-open', 'false');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Select a Schedule')).toBeInTheDocument();
      expect(screen.getByText('Please select a schedule from the analytics page to view its execution history')).toBeInTheDocument();
      expect(screen.getByText('Go to Analytics')).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    (scheduleApi.getById as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      const loadingBackdrop = screen.getByTestId('loading-backdrop');
      expect(loadingBackdrop).toHaveAttribute('data-is-open', 'false');
    });
    
    expect(console.error).toHaveBeenCalledWith('Failed to fetch execution data:', expect.any(Error));
    
    await waitFor(() => {
      expect(screen.getByText('Select a Schedule')).toBeInTheDocument();
    });
  });
});
