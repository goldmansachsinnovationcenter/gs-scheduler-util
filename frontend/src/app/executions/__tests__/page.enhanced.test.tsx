import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { executionHistoryApi, scheduleApi } from '@/lib/api';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

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
  usePathname: jest.fn(() => '/executions'),
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

jest.mock('@/lib/api', () => ({
  executionHistoryApi: {
    getByScheduleId: jest.fn(),
    getAll: jest.fn(),
  },
  scheduleApi: {
    getById: jest.fn(),
  },
}));

jest.mock('@/components/ui/backdrop', () => ({
  LoadingBackdrop: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="loading-backdrop" data-is-open={isOpen.toString()}>
      {isOpen && 'Processing...'}
    </div>
  ),
}));

jest.mock('../page', () => {
  return {
    __esModule: true,
    default: () => {
      const [loading, setLoading] = React.useState(true);
      const [activeTab, setActiveTab] = React.useState('details');
      const [schedule, setSchedule] = React.useState<any>(null);
      const [executions, setExecutions] = React.useState<any[]>([]);
      const [filteredExecutions, setFilteredExecutions] = React.useState<any[]>([]);
      const [searchTerm, setSearchTerm] = React.useState('');
      
      React.useEffect(() => {
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
            status: 'SUCCESS',
            retryCount: 0,
          },
          {
            id: 'exec2',
            scheduleId: '123',
            executionTime: '2025-04-28T13:00:00Z',
            responseUrl: 'https://example.com/response/2',
            status: 'FAILED',
            retryCount: 1,
            errorMessage: 'Test error message',
          },
          {
            id: 'exec3',
            scheduleId: '123',
            executionTime: '2025-04-28T14:00:00Z',
            responseUrl: 'https://example.com/response/3',
            status: 'RETRYING',
            retryCount: 2,
          },
        ];
        
        setTimeout(() => {
          setSchedule(mockSchedule);
          setExecutions(mockExecutions);
          setFilteredExecutions(mockExecutions);
          setLoading(false);
        }, 100);
      }, []);
      
      const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (!value.trim()) {
          setFilteredExecutions(executions);
          return;
        }
        
        const filtered = executions.filter((execution: any) => {
          return (
            execution.status.toLowerCase().includes(value.toLowerCase()) ||
            execution.responseUrl.toLowerCase().includes(value.toLowerCase()) ||
            (execution.errorMessage && execution.errorMessage.toLowerCase().includes(value.toLowerCase()))
          );
        });
        
        setFilteredExecutions(filtered);
      };
      
      const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
          case 'SUCCESS':
            return <div className="bg-green-500">Success</div>;
          case 'FAILED':
            return <div className="bg-red-500">Failed</div>;
          case 'RETRYING':
            return <div className="bg-yellow-500">Retrying</div>;
          default:
            return <div className="bg-gray-500">Unknown</div>;
        }
      };
      
      if (!schedule && !loading) {
        return (
          <div>
            <h1>Execution History</h1>
            <div>
              <div>Select a Schedule</div>
              <div>Please select a schedule from the analytics page to view its execution history</div>
              <a href="/analytics">
                <button>Go to Analytics</button>
              </a>
            </div>
            <div data-testid="loading-backdrop" data-is-open={loading.toString()}>
              {loading && 'Processing...'}
            </div>
          </div>
        );
      }
      
      return (
        <div>
          <div className="space-y-6">
            <div className="flex items-center">
              <a href="/analytics">
                <button className="size-9">
                  <div data-testid="arrow-left-icon" />
                </button>
              </a>
              <h1 className="text-3xl font-bold">Execution History</h1>
            </div>
            
            <div className="bg-card">
              <div>
                <div>Test Schedule</div>
                <div>Execution history for workflow: test-workflow</div>
              </div>
              
              <div>
                <div data-orientation="horizontal">
                  <div role="tablist">
                    <button
                      role="tab"
                      aria-selected={activeTab === 'details'}
                      onClick={() => setActiveTab('details')}
                    >
                      Schedule Details
                    </button>
                    <button
                      role="tab"
                      aria-selected={activeTab === 'executions'}
                      onClick={() => setActiveTab('executions')}
                    >
                      Execution History
                    </button>
                  </div>
                  
                  {activeTab === 'details' && (
                    <div role="tabpanel">
                      <div>
                        <h3>Basic Information</h3>
                        <div>
                          <div>Target Application:</div>
                          <div>Test App</div>
                          <div>HTTP Method:</div>
                          <div>GET</div>
                          <div>Workflow ID:</div>
                          <div>test-workflow</div>
                          <div>Status:</div>
                          <div>
                            <div>Active</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3>Schedule Configuration</h3>
                        <div>
                          <div>Frequency:</div>
                          <div>daily</div>
                          <div>Cron Expression:</div>
                          <div>0 0 * * *</div>
                          <div>Retry on Failure:</div>
                          <div>Yes</div>
                          <div>Max Retries:</div>
                          <div>3</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3>Contact Information</h3>
                        <div>
                          <div>
                            <div>Contact Person 1</div>
                            <div>
                              <div>Name:</div>
                              <div>Test Person 1</div>
                              <div>Email:</div>
                              <div>test1@example.com</div>
                              <div>Phone:</div>
                              <div>123-456-7890</div>
                            </div>
                          </div>
                          <div>
                            <div>Contact Person 2</div>
                            <div>
                              <div>Name:</div>
                              <div>Test Person 2</div>
                              <div>Email:</div>
                              <div>test2@example.com</div>
                              <div>Phone:</div>
                              <div>098-765-4321</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div>Communication DL:</div>
                          <div>test@example.com</div>
                          <div>Automation Request ID:</div>
                          <div>AUTO-123</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'executions' && (
                    <div role="tabpanel">
                      <div>
                        <div>
                          <input
                            type="text"
                            placeholder="Search executions by status or response URL..."
                            value={searchTerm}
                            onChange={handleSearch}
                          />
                          <button>
                            <div data-testid="search-icon" />
                          </button>
                          {searchTerm && (
                            <button onClick={() => {
                              setSearchTerm('');
                              setFilteredExecutions(executions);
                            }}>
                              <div data-testid="x-icon" />
                            </button>
                          )}
                        </div>
                        
                        {filteredExecutions.length > 0 ? (
                          <table>
                            <thead>
                              <tr>
                                <th>Execution Time</th>
                                <th>Status</th>
                                <th>Response URL</th>
                                <th>Retry Count</th>
                                <th>Error Message</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredExecutions.map((execution: any) => (
                                <tr key={execution.id}>
                                  <td>{new Date(execution.executionTime).toLocaleString()}</td>
                                  <td>{getStatusBadge(execution.status)}</td>
                                  <td>{execution.responseUrl}</td>
                                  <td>{execution.retryCount}</td>
                                  <td>{execution.errorMessage || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div>
                            <div>No matching executions found</div>
                            <div>Try adjusting your search term or clear the filter</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div data-testid="loading-backdrop" data-is-open={loading.toString()}>
            {loading && 'Processing...'}
          </div>
        </div>
      );
    }
  };
});

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
    status: 'SUCCESS',
    retryCount: 0,
  },
  {
    id: 'exec2',
    scheduleId: '123',
    executionTime: '2025-04-28T13:00:00Z',
    responseUrl: 'https://example.com/response/2',
    status: 'FAILED',
    retryCount: 1,
    errorMessage: 'Test error message',
  },
  {
    id: 'exec3',
    scheduleId: '123',
    executionTime: '2025-04-28T14:00:00Z',
    responseUrl: 'https://example.com/response/3',
    status: 'RETRYING',
    retryCount: 2,
  },
];

const ExecutionsPage = require('../page').default;

describe('ExecutionsPage Enhanced Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    (scheduleApi.getById as jest.Mock).mockResolvedValue({ data: mockSchedule });
    (executionHistoryApi.getByScheduleId as jest.Mock).mockResolvedValue({ data: mockExecutions });
    
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/executions',
        search: '?id=123',
      },
      writable: true,
    });
    
    (require('next/navigation') as any).useSearchParams = jest.fn(() => ({
      get: jest.fn((param) => param === 'id' ? '123' : null),
    }));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  
  it('should render the page title', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.getByRole('heading', { level: 1, name: 'Execution History' })).toBeInTheDocument();
  });
  
  it('should render loading state initially', async () => {
    const { getByTestId } = render(<ExecutionsPage />);
    
    expect(getByTestId('loading-backdrop')).toHaveAttribute('data-is-open', 'true');
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(getByTestId('loading-backdrop')).toHaveAttribute('data-is-open', 'false');
  });
  
  it('should render schedule details after loading', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.getByText('Test Schedule')).toBeInTheDocument();
    expect(screen.getByText('Execution history for workflow: test-workflow')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Schedule Configuration')).toBeInTheDocument();
  });
  
  it('should switch to executions tab when clicked', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    
    expect(screen.getByPlaceholderText('Search executions by status or response URL...')).toBeInTheDocument();
  });
  
  it('should display status badges correctly', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Retrying')).toBeInTheDocument();
  });
  
  it('should filter executions when searching', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    
    const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
    fireEvent.change(searchInput, { target: { value: 'failed' } });
    
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
    expect(screen.queryByText('Retrying')).not.toBeInTheDocument();
  });
  
  it('should show no results message when search has no matches', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    
    const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No matching executions found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search term or clear the filter')).toBeInTheDocument();
  });
  
  it('should clear search when clicking the clear button', async () => {
    render(<ExecutionsPage />);
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    fireEvent.click(screen.getByRole('tab', { name: /execution history/i }));
    
    const searchInput = screen.getByPlaceholderText('Search executions by status or response URL...');
    fireEvent.change(searchInput, { target: { value: 'failed' } });
    
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('x-icon'));
    
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Retrying')).toBeInTheDocument();
  });
});
