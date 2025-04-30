import axios from 'axios';
import { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('API Services', () => {
  let mockAxiosInstance: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
    };
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });
  
  describe('scheduleApi', () => {
    test('getAll should call the correct endpoint', async () => {
      await scheduleApi.getAll();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/schedules');
    });
    
    test('getById should call the correct endpoint with ID', async () => {
      await scheduleApi.getById('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/schedules/123');
    });
    
    test('create should call the correct endpoint with data', async () => {
      const mockData = { name: 'Test Schedule' };
      await scheduleApi.create(mockData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules', mockData);
    });
    
    test('update should call the correct endpoint with ID and data', async () => {
      const mockData = { name: 'Updated Schedule' };
      await scheduleApi.update('123', mockData);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/schedules/123', mockData);
    });
    
    test('delete should call the correct endpoint with ID', async () => {
      await scheduleApi.delete('123');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/schedules/123');
    });
    
    test('activate should call the correct endpoint with ID', async () => {
      await scheduleApi.activate('123');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules/123/activate');
    });
    
    test('deactivate should call the correct endpoint with ID', async () => {
      await scheduleApi.deactivate('123');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules/123/deactivate');
    });
  });
  
  describe('analyticsApi', () => {
    test('getAllWithSuccessRates should call the correct endpoint', async () => {
      await analyticsApi.getAllWithSuccessRates();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules');
    });
    
    test('search should call the correct endpoint with search term', async () => {
      await analyticsApi.search('test');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules/search?term=test');
    });
    
    test('getSuccessRateStatistics should call the correct endpoint', async () => {
      await analyticsApi.getSuccessRateStatistics();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/success-rates');
    });
    
    test('getScheduleSuccessRate should call the correct endpoint with ID', async () => {
      await analyticsApi.getScheduleSuccessRate('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules/123/success-rate');
    });
  });
  
  describe('executionHistoryApi', () => {
    test('getAll should call the correct endpoint', async () => {
      await executionHistoryApi.getAll();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories');
    });
    
    test('getByScheduleId should call the correct endpoint with schedule ID', async () => {
      await executionHistoryApi.getByScheduleId('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories/schedule/123');
    });
    
    test('getById should call the correct endpoint with ID', async () => {
      await executionHistoryApi.getById('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories/123');
    });
  });
});
