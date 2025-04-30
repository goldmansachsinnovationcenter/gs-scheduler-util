import React from 'react';
import { render, screen, act } from '@testing-library/react';
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
  X: () => <div data-testid="x-icon" />,
}));

describe('ExecutionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (scheduleApi.getById as jest.Mock).mockResolvedValue({
      data: {
        id: '123',
        name: 'Test Schedule',
        description: 'Test description',
        targetApplication: 'Test App',
        httpMethod: 'GET',
        workflowId: 'test-workflow',
        status: 'Active',
        frequency: 'daily',
        cronExpression: '0 0 * * *',
        retryOnFailure: true,
        maxRetries: 3,
        contactPersons: [
          { name: 'Test Person 1', email: 'test1@example.com', phone: '123-456-7890' },
          { name: 'Test Person 2', email: 'test2@example.com', phone: '098-765-4321' }
        ],
        communicationDL: 'test@example.com',
        automationRequestId: 'AUTO-123'
      }
    });
    
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({
      data: [
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
        }
      ]
    });
  });

  it('should render the page title', () => {
    render(<ExecutionsPage />);
    expect(screen.getByText('Execution History')).toBeInTheDocument();
  });

  it('should render the loading state initially', () => {
    render(<ExecutionsPage />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should call the API with the correct parameters', async () => {
    (scheduleApi.getById as jest.Mock).mockImplementation(() => Promise.resolve({
      data: {
        id: '123',
        name: 'Test Schedule'
      }
    }));
    
    (executionHistoryApi.getByScheduleId as jest.Mock).mockImplementation(() => Promise.resolve({
      data: [{ id: '1', scheduleId: '123' }]
    }));
    
    render(<ExecutionsPage />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });
    
    expect(scheduleApi.getById).toHaveBeenCalledWith('123');
    expect(executionHistoryApi.getByScheduleId).toHaveBeenCalledWith('123');
  });

  it('should render the back button with arrow icon', () => {
    render(<ExecutionsPage />);
    const arrowIcon = screen.getByTestId('arrow-left-icon');
    expect(arrowIcon).toBeInTheDocument();
    
    const button = arrowIcon.closest('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle API error gracefully', () => {
    (scheduleApi.getById as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<ExecutionsPage />);
    
    expect(screen.getByText('Execution History')).toBeInTheDocument();
  });
});
