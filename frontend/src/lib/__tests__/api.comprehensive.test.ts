import axios from 'axios';
import api, { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('API Configuration', () => {
  it('should create axios instance with correct base URL and headers', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should use environment variable for API URL if available', () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: 'https://test-api.example.com/api' };
    
    jest.resetModules();
    require('../api');
    
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'https://test-api.example.com/api',
    }));
    
    process.env = originalEnv;
  });

  it('should use default URL if environment variable is not available', () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_API_URL;
    
    jest.resetModules();
    require('../api');
    
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'http://localhost:8080/api',
    }));
    
    process.env = originalEnv;
  });
});

describe('Schedule API', () => {
  const mockApi = axios.create() as jest.Mocked<typeof api>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAll with correct endpoint', () => {
    scheduleApi.getAll();
    expect(mockApi.get).toHaveBeenCalledWith('/schedules');
  });

  it('should call getById with correct endpoint and ID', () => {
    scheduleApi.getById('123');
    expect(mockApi.get).toHaveBeenCalledWith('/schedules/123');
  });

  it('should call create with correct endpoint and data', () => {
    const mockData = { name: 'Test Schedule' };
    scheduleApi.create(mockData);
    expect(mockApi.post).toHaveBeenCalledWith('/schedules', mockData);
  });

  it('should call update with correct endpoint, ID, and data', () => {
    const mockData = { name: 'Updated Schedule' };
    scheduleApi.update('123', mockData);
    expect(mockApi.put).toHaveBeenCalledWith('/schedules/123', mockData);
  });

  it('should call delete with correct endpoint and ID', () => {
    scheduleApi.delete('123');
    expect(mockApi.delete).toHaveBeenCalledWith('/schedules/123');
  });

  it('should call activate with correct endpoint and ID', () => {
    scheduleApi.activate('123');
    expect(mockApi.post).toHaveBeenCalledWith('/schedules/123/activate');
  });

  it('should call deactivate with correct endpoint and ID', () => {
    scheduleApi.deactivate('123');
    expect(mockApi.post).toHaveBeenCalledWith('/schedules/123/deactivate');
  });
});

describe('Analytics API', () => {
  const mockApi = axios.create() as jest.Mocked<typeof api>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAllWithSuccessRates with correct endpoint', () => {
    analyticsApi.getAllWithSuccessRates();
    expect(mockApi.get).toHaveBeenCalledWith('/analytics/schedules');
  });

  it('should call search with correct endpoint and search term', () => {
    analyticsApi.search('test');
    expect(mockApi.get).toHaveBeenCalledWith('/analytics/schedules/search?term=test');
  });

  it('should call getSuccessRateStatistics with correct endpoint', () => {
    analyticsApi.getSuccessRateStatistics();
    expect(mockApi.get).toHaveBeenCalledWith('/analytics/success-rates');
  });

  it('should call getScheduleSuccessRate with correct endpoint and ID', () => {
    analyticsApi.getScheduleSuccessRate('123');
    expect(mockApi.get).toHaveBeenCalledWith('/analytics/schedules/123/success-rate');
  });
});

describe('Execution History API', () => {
  const mockApi = axios.create() as jest.Mocked<typeof api>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAll with correct endpoint', () => {
    executionHistoryApi.getAll();
    expect(mockApi.get).toHaveBeenCalledWith('/execution-histories');
  });

  it('should call getByScheduleId with correct endpoint and schedule ID', () => {
    executionHistoryApi.getByScheduleId('123');
    expect(mockApi.get).toHaveBeenCalledWith('/execution-histories/schedule/123');
  });

  it('should call getById with correct endpoint and ID', () => {
    executionHistoryApi.getById('123');
    expect(mockApi.get).toHaveBeenCalledWith('/execution-histories/123');
  });
});
