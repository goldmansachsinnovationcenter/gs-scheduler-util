import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsPage from '../page';
import { analyticsApi } from '../../../lib/api';

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
    get: jest.fn(),
  })),
  usePathname: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
}));

jest.mock('../../../lib/api', () => ({
  analyticsApi: {
    getAllWithSuccessRates: jest.fn(),
  },
}));

describe('AnalyticsPage Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle API error gracefully', async () => {
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      const backdrop = screen.queryByText('Processing...');
      expect(backdrop).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Error loading schedules')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('should render different success rate badges correctly', async () => {
    const mockSchedules = [
      {
        id: '1',
        description: 'High Success Rate',
        workflowIdentifier: 'workflow-1',
        targetApplication: 'App 1',
        successRate: 95,
      },
      {
        id: '2',
        description: 'Medium Success Rate',
        workflowIdentifier: 'workflow-2',
        targetApplication: 'App 2',
        successRate: 75,
      },
      {
        id: '3',
        description: 'Low Success Rate',
        workflowIdentifier: 'workflow-3',
        targetApplication: 'App 3',
        successRate: 30,
      },
    ];
    
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue({ data: mockSchedules });
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      const backdrop = screen.queryByText('Processing...');
      expect(backdrop).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('High (95%)')).toBeInTheDocument();
    expect(screen.getByText('Medium (75%)')).toBeInTheDocument();
    expect(screen.getByText('Low (30%)')).toBeInTheDocument();
  });

  it('should display message when no schedules are available', async () => {
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue({ data: [] });
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      const backdrop = screen.queryByText('Processing...');
      expect(backdrop).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('No schedules found')).toBeInTheDocument();
    expect(screen.getByText('Create a new schedule to get started')).toBeInTheDocument();
    
    expect(screen.getByText('Create New Schedule')).toBeInTheDocument();
  });
});
