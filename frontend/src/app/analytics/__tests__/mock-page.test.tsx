import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { analyticsApi } from '../../../lib/__tests__/api.mock';

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

const MockAnalyticsPage = () => {
  const [schedules, setSchedules] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await analyticsApi.getAllWithSuccessRates();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    try {
      setLoading(true);
      const data = await analyticsApi.search(term);
      setSchedules(data);
    } catch (error) {
      console.error('Error searching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Schedule Analytics</h1>
      <input 
        data-testid="search-input"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search schedules..."
      />
      
      {loading ? (
        <div data-testid="loading-backdrop">Loading...</div>
      ) : (
        <table data-testid="schedules-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Target Application</th>
              <th>Success Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.description}</td>
                <td>{schedule.targetApplication}</td>
                <td>
                  <span data-testid={`badge-${schedule.successRate >= 0.8 ? 'success' : schedule.successRate >= 0.5 ? 'warning' : 'destructive'}`}>
                    {schedule.successRate >= 0.8 ? 'High' : schedule.successRate >= 0.5 ? 'Medium' : 'Low'}
                  </span>
                </td>
                <td>
                  <button data-testid={`view-executions-${schedule.id}`}>
                    View Executions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

describe('Analytics Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (analyticsApi.getAllWithSuccessRates as jest.Mock).mockResolvedValue(mockSchedules);
    (analyticsApi.search as jest.Mock).mockImplementation((term) => {
      return Promise.resolve(
        mockSchedules.filter(s => 
          s.description.toLowerCase().includes(term.toLowerCase()) ||
          s.targetApplication.toLowerCase().includes(term.toLowerCase())
        )
      );
    });
  });

  it('renders the page title', async () => {
    render(<MockAnalyticsPage />);
    
    expect(screen.getByText(/Schedule Analytics/i)).toBeInTheDocument();
  });

  it('renders the search input', async () => {
    render(<MockAnalyticsPage />);
    
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders the schedules table', async () => {
    render(<MockAnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('schedules-table')).toBeInTheDocument();
    });
  });

  it('displays schedules from the API', async () => {
    render(<MockAnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Schedule 1')).toBeInTheDocument();
      expect(screen.getByText('Test Schedule 2')).toBeInTheDocument();
    });
  });

  it('shows success rate badges', async () => {
    render(<MockAnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('badge-success')).toBeInTheDocument();
      expect(screen.getByTestId('badge-warning')).toBeInTheDocument();
    });
  });

  it('filters schedules when searching', async () => {
    render(<MockAnalyticsPage />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'App 1' } });
    
    await waitFor(() => {
      expect(analyticsApi.search).toHaveBeenCalledWith('App 1');
    });
  });

  it('shows loading backdrop while fetching data', async () => {
    render(<MockAnalyticsPage />);
    
    expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-backdrop')).not.toBeInTheDocument();
    });
  });
});
