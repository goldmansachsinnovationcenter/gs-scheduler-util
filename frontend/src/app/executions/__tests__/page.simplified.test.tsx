import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionsPage from '../page';
import { scheduleApi, executionHistoryApi } from '../../../lib/api';

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
  useParams: jest.fn(() => ({})),
}));

jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
}));

jest.mock('../../../lib/api', () => ({
  scheduleApi: {
    getById: jest.fn(),
    getAll: jest.fn(),
  },
  executionHistoryApi: {
    getByScheduleId: jest.fn(),
  },
}));

describe('ExecutionsPage Simplified Tests', () => {
  const mockSchedule = {
    id: '123',
    description: 'Test Schedule',
    cronExpression: '0 0 * * *',
    frequency: 'daily',
    httpMethod: 'GET',
    workflowIdentifier: 'test-workflow',
    targetApplication: 'Test App',
    retryOnFailure: true,
    maxRetries: 3,
    status: 'active',
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
    communicationDL: 'test@example.com',
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    render(<ExecutionsPage />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should render schedule details after loading', async () => {
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
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    expect(screen.getByText('Execution history for workflow: test-workflow')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Schedule Configuration')).toBeInTheDocument();
  });

  it('should handle API error gracefully', async () => {
    (scheduleApi.getById as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Error loading schedule')).toBeInTheDocument();
  });
});
