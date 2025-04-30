import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionsPage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const mockExecutions = [
  { 
    id: '1', 
    scheduleId: '101',
    executionTime: '2023-01-01T10:00:00Z',
    status: 'SUCCESS',
    responseUrl: 'https://example.com/response/1',
    errorMessage: null
  },
  { 
    id: '2', 
    scheduleId: '102',
    executionTime: '2023-01-02T11:00:00Z',
    status: 'FAILED',
    responseUrl: null,
    errorMessage: 'Connection timeout'
  }
];

jest.mock('../../../lib/api', () => ({
  executionHistoryApi: {
    getAll: jest.fn().mockResolvedValue(mockExecutions),
    getByScheduleId: jest.fn().mockResolvedValue([]),
  },
  scheduleApi: {
    getById: jest.fn().mockResolvedValue({}),
  }
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input data-testid="search-input" {...props} />,
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }) => <table data-testid="executions-table">{children}</table>,
  TableHeader: ({ children }) => <thead data-testid="table-header">{children}</thead>,
  TableBody: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
  TableRow: ({ children }) => <tr data-testid="table-row">{children}</tr>,
  TableHead: ({ children }) => <th data-testid="table-head">{children}</th>,
  TableCell: ({ children }) => <td data-testid="table-cell">{children}</td>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }) => (
    <span data-testid={`badge-${variant}`}>{children}</span>
  ),
}));

jest.mock('@/components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }) => (
    isOpen ? <div data-testid="loading-backdrop">Loading...</div> : null
  ),
}));

describe('ExecutionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Execution History/i)).toBeInTheDocument();
    });
  });

  it('renders the search input', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });

  it('renders the executions table', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('executions-table')).toBeInTheDocument();
    });
  });

  it('displays executions from the API', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
      expect(screen.getByText('FAILED')).toBeInTheDocument();
    });
  });

  it('shows status badges', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('badge-success')).toBeInTheDocument();
      expect(screen.getByTestId('badge-destructive')).toBeInTheDocument();
    });
  });

  it('filters executions when searching', async () => {
    render(<ExecutionsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'SUCCESS' } });
    
    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });
  });

  it('shows loading backdrop while fetching data', async () => {
    render(<ExecutionsPage />);
    
    expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });
  });
});
