import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsPage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockSchedules = [
  { 
    id: '1', 
    description: 'Test Schedule 1', 
    successRate: 0.95,
    targetApplication: 'App 1',
    contactPersons: [{ name: 'John Doe', email: 'john@example.com' }],
    communicationDL: 'team@example.com'
  },
  { 
    id: '2', 
    description: 'Test Schedule 2', 
    successRate: 0.65,
    targetApplication: 'App 2',
    contactPersons: [{ name: 'Jane Smith', email: 'jane@example.com' }],
    communicationDL: 'team@example.com'
  }
];

jest.mock('../../../lib/api', () => ({
  analyticsApi: {
    getAllWithSuccessRates: jest.fn().mockResolvedValue(mockSchedules),
    search: jest.fn().mockImplementation((term) => {
      return Promise.resolve(
        mockSchedules.filter(s => 
          s.description.toLowerCase().includes(term.toLowerCase()) ||
          s.targetApplication.toLowerCase().includes(term.toLowerCase())
        )
      );
    }),
  },
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input data-testid="search-input" {...props} />,
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }) => <table data-testid="schedules-table">{children}</table>,
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

describe('AnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Schedule Analytics/i)).toBeInTheDocument();
    });
  });

  it('renders the search input', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });

  it('renders the schedules table', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('schedules-table')).toBeInTheDocument();
    });
  });

  it('displays schedules from the API', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule 1')).toBeInTheDocument();
      expect(screen.getByText('Test Schedule 2')).toBeInTheDocument();
    });
  });

  it('shows success rate badges', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('badge-success')).toBeInTheDocument();
      expect(screen.getByTestId('badge-warning')).toBeInTheDocument();
    });
  });

  it('filters schedules when searching', async () => {
    const { analyticsApi } = require('../../../lib/api');
    
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'App 1' } });
    
    await waitFor(() => {
      expect(analyticsApi.search).toHaveBeenCalledWith('App 1');
    });
  });

  it('shows loading backdrop while fetching data', async () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });
  });
});
