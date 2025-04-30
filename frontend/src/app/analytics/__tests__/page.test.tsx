import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsPage from '../page';
import { analyticsApi } from '@/lib/api';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Search: () => <div data-testid="search-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
}));

jest.mock('@/lib/api', () => ({
  analyticsApi: {
    getAllWithSuccessRates: jest.fn(),
    search: jest.fn(),
    getSuccessRateStatistics: jest.fn(),
    getScheduleSuccessRate: jest.fn(),
  },
}));

describe('AnalyticsPage', () => {
  const mockSchedules = [
    {
      id: '1',
      description: 'Daily Report',
      workflowIdentifier: 'daily-report',
      targetApplication: 'Reporting System',
      httpMethod: 'GET',
      frequency: 'daily',
      cronExpression: '0 0 * * *',
      active: true,
      successRate: 95,
      lastExecutionTime: '2025-04-28T12:00:00Z',
    },
    {
      id: '2',
      description: 'Weekly Backup',
      workflowIdentifier: 'weekly-backup',
      targetApplication: 'Backup System',
      httpMethod: 'POST',
      frequency: 'weekly',
      cronExpression: '0 0 * * 0',
      active: true,
      successRate: 85,
      lastExecutionTime: '2025-04-28T12:00:00Z',
    },
    {
      id: '3',
      description: 'Monthly Cleanup',
      workflowIdentifier: 'monthly-cleanup',
      targetApplication: 'Cleanup System',
      httpMethod: 'POST',
      frequency: 'monthly',
      cronExpression: '0 0 1 * *',
      active: false,
      successRate: 65,
      lastExecutionTime: '2025-04-28T12:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue({ data: mockSchedules });
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the page title', () => {
    render(<AnalyticsPage />);
    expect(screen.getByText('Schedule Analytics')).toBeInTheDocument();
  });

  it('should render the search input', () => {
    render(<AnalyticsPage />);
    expect(screen.getByPlaceholderText('Search schedules by description, workflow ID, or application...')).toBeInTheDocument();
  });

  it('should render loading backdrop initially', () => {
    const { container } = render(<AnalyticsPage />);
    const backdrop = container.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
  });

  it('should fetch and display schedules', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
      expect(screen.getByText('Weekly Backup')).toBeInTheDocument();
      expect(screen.getByText('Monthly Cleanup')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.getByText('Target Application')).toBeInTheDocument();
    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    expect(screen.getByText('daily-report')).toBeInTheDocument();
    expect(screen.getByText('weekly-backup')).toBeInTheDocument();
    expect(screen.getByText('monthly-cleanup')).toBeInTheDocument();
    expect(screen.getByText('Reporting System')).toBeInTheDocument();
    expect(screen.getByText('Backup System')).toBeInTheDocument();
    expect(screen.getByText('Cleanup System')).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getAllByText('POST').length).toBe(2);
    
    expect(screen.getByText('High (95%)')).toBeInTheDocument();
    expect(screen.getByText('Medium (85%)')).toBeInTheDocument();
    expect(screen.getByText('Low (65%)')).toBeInTheDocument();
    
    expect(screen.getAllByText('Active').length).toBe(2);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    
    expect(screen.getAllByText('History').length).toBe(3);
  });

  it('should filter schedules based on search term', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search schedules by description, workflow ID, or application...');
    fireEvent.change(searchInput, { target: { value: 'backup' } });
    
    await waitFor(() => {
      expect(screen.getByText('Weekly Backup')).toBeInTheDocument();
      expect(screen.queryByText('Daily Report')).not.toBeInTheDocument();
      expect(screen.queryByText('Monthly Cleanup')).not.toBeInTheDocument();
    });
  });

  it('should display "No matching schedules found" when search has no results', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search schedules by description, workflow ID, or application...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No matching schedules found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search term or clear the filter')).toBeInTheDocument();
    });
  });

  it('should display "No schedules available" when there are no schedules', async () => {
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue({ data: [] });
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByText('No schedules available')).toBeInTheDocument();
      expect(screen.getByText('Create your first schedule to see analytics')).toBeInTheDocument();
      expect(screen.getByText('Create Schedule')).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should render success rate badges correctly', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
    });
    
    const highBadge = screen.getByText('High (95%)');
    expect(highBadge).toBeInTheDocument();
    expect(highBadge.closest('.bg-green-500')).toBeInTheDocument();
    
    const mediumBadge = screen.getByText('Medium (85%)');
    expect(mediumBadge).toBeInTheDocument();
    expect(mediumBadge.closest('.bg-yellow-500')).toBeInTheDocument();
    
    const lowBadge = screen.getByText('Low (65%)');
    expect(lowBadge).toBeInTheDocument();
    expect(lowBadge.closest('.bg-red-500')).toBeInTheDocument();
  });

  it('should link to execution history page', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
    });
    
    const historyLinks = screen.getAllByText('History');
    expect(historyLinks[0].closest('a')).toHaveAttribute('href', '/executions/1');
    expect(historyLinks[1].closest('a')).toHaveAttribute('href', '/executions/2');
    expect(historyLinks[2].closest('a')).toHaveAttribute('href', '/executions/3');
  });

  it('should display cron expression for repetitive schedules', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
    });
    
    expect(screen.getByText('0 0 * * *')).toBeInTheDocument();
    expect(screen.getByText('0 0 * * 0')).toBeInTheDocument();
    expect(screen.getByText('0 0 1 * *')).toBeInTheDocument();
  });

  it('should display "Once" for one-time schedules', async () => {
    const schedulesWithOnce = [
      ...mockSchedules,
      {
        id: '4',
        description: 'One-time Task',
        workflowIdentifier: 'one-time-task',
        targetApplication: 'Task System',
        httpMethod: 'GET',
        frequency: 'once',
        cronExpression: '',
        active: true,
        successRate: 100,
        lastExecutionTime: '2025-04-28T12:00:00Z',
      },
    ];
    
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue({ data: schedulesWithOnce });
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('One-time Task')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Once')).toBeInTheDocument();
  });
});
