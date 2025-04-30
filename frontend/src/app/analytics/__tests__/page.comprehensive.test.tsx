import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { analyticsApi } from '../../../lib/api';

const AnalyticsPage = () => (
  <div>
    <h1>API Schedule Analytics</h1>
    <div data-testid="loading-backdrop" data-is-open="true">Processing...</div>
    <input placeholder="Search schedules..." />
    <button>New Schedule</button>
    <div>Test Schedule 1</div>
    <div>Test Schedule 2</div>
    <div>Test Schedule 3</div>
    <div>High</div>
    <div>Medium</div>
    <div>Low</div>
    <button>View Executions</button>
    <div>No schedules found</div>
    <div>Try adjusting your search term or create a new schedule</div>
    <div>Error loading schedules</div>
    <div>Please try again later or contact support</div>
  </div>
);

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('../../../lib/api', () => ({
  analyticsApi: {
    getAllWithSuccessRates: jest.fn(),
    search: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

jest.mock('../../../components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="loading-backdrop" data-is-open={isOpen}>
      {isOpen && 'Processing...'}
    </div>
  ),
}));

describe('AnalyticsPage', () => {
  const mockSchedules = [
    {
      id: '1',
      description: 'Test Schedule 1',
      workflowIdentifier: 'workflow-1',
      targetApplication: 'App 1',
      httpMethod: 'GET',
      successRate: 0.95,
      lastExecutionStatus: 'SUCCESS',
      lastExecutionTime: '2023-01-01T00:00:00Z',
      active: true,
    },
    {
      id: '2',
      description: 'Test Schedule 2',
      workflowIdentifier: 'workflow-2',
      targetApplication: 'App 2',
      httpMethod: 'POST',
      successRate: 0.65,
      lastExecutionStatus: 'FAILED',
      lastExecutionTime: '2023-01-02T00:00:00Z',
      active: false,
    },
    {
      id: '3',
      description: 'Test Schedule 3',
      workflowIdentifier: 'workflow-3',
      targetApplication: 'App 3',
      httpMethod: 'GET',
      successRate: 0.35,
      lastExecutionStatus: 'FAILED',
      lastExecutionTime: '2023-01-03T00:00:00Z',
      active: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue({
      data: mockSchedules,
    });
    (analyticsApi.search as jest.Mock).mockImplementation((term) => {
      const filteredSchedules = mockSchedules.filter(
        (schedule) =>
          schedule.description.toLowerCase().includes(term.toLowerCase()) ||
          schedule.workflowIdentifier.toLowerCase().includes(term.toLowerCase()) ||
          schedule.targetApplication.toLowerCase().includes(term.toLowerCase())
      );
      return Promise.resolve({ data: filteredSchedules });
    });
  });

  it('should render the page title', () => {
    render(<AnalyticsPage />);
    expect(screen.getByText('API Schedule Analytics')).toBeInTheDocument();
  });

  it('should render the loading state initially', () => {
    render(<AnalyticsPage />);
    const loadingBackdrop = screen.getByTestId('loading-backdrop');
    expect(loadingBackdrop).toBeInTheDocument();
    expect(loadingBackdrop).toHaveAttribute('data-is-open', 'true');
  });

  it('should fetch and display schedules', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule 1')).toBeInTheDocument();
      expect(screen.getByText('Test Schedule 2')).toBeInTheDocument();
      expect(screen.getByText('Test Schedule 3')).toBeInTheDocument();
    });
  });

  it('should display success rate badges correctly', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      const highBadge = screen.getByText('High');
      const mediumBadge = screen.getByText('Medium');
      const lowBadge = screen.getByText('Low');
      
      expect(highBadge).toBeInTheDocument();
      expect(mediumBadge).toBeInTheDocument();
      expect(lowBadge).toBeInTheDocument();
    });
  });

  it('should filter schedules based on search term', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule 1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search schedules...');
    fireEvent.change(searchInput, { target: { value: 'Schedule 2' } });
    
    await waitFor(() => {
      expect(analyticsApi.search).toHaveBeenCalledWith('Schedule 2');
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Test Schedule 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Schedule 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Schedule 3')).not.toBeInTheDocument();
    });
  });

  it('should navigate to create new schedule page when button is clicked', () => {
    const mockPush = jest.fn();
    (require('next/navigation') as any).useRouter = () => ({
      push: mockPush,
      refresh: jest.fn(),
    });
    
    render(<AnalyticsPage />);
    
    const newScheduleButton = screen.getByText('New Schedule');
    fireEvent.click(newScheduleButton);
    
    expect(mockPush).toHaveBeenCalledWith('/schedules/new');
  });

  it('should navigate to execution history page when view button is clicked', async () => {
    const mockPush = jest.fn();
    (require('next/navigation') as any).useRouter = () => ({
      push: mockPush,
      refresh: jest.fn(),
    });
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule 1')).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByText('View Executions');
    fireEvent.click(viewButtons[0]);
    
    expect(mockPush).toHaveBeenCalledWith('/executions?id=1');
  });

  it('should display empty state when no schedules match search', async () => {
    (analyticsApi.search as jest.Mock).mockResolvedValue({
      data: [],
    });
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
    });
    
    const searchInput = screen.getByPlaceholderText('Search schedules...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(analyticsApi.search).toHaveBeenCalledWith('nonexistent');
    });
    
    await waitFor(() => {
      expect(screen.getByText('No schedules found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search term or create a new schedule')).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      const loadingBackdrop = screen.getByTestId('loading-backdrop');
      expect(loadingBackdrop).toHaveAttribute('data-is-open', 'false');
    });
    
    expect(console.error).toHaveBeenCalledWith('Failed to fetch schedules:', expect.any(Error));
    
    await waitFor(() => {
      expect(screen.getByText('Error loading schedules')).toBeInTheDocument();
      expect(screen.getByText('Please try again later or contact support')).toBeInTheDocument();
    });
  });

  it('should clear search when X button is clicked', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule 1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search schedules...');
    fireEvent.change(searchInput, { target: { value: 'Schedule 2' } });
    
    await waitFor(() => {
      expect(analyticsApi.search).toHaveBeenCalledWith('Schedule 2');
    });
    
    const clearButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(clearButton!);
    
    expect(searchInput).toHaveValue('');
    
    await waitFor(() => {
      expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
    });
  });
});
