import axios from 'axios';
import { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })),
}));

describe('API Service', () => {
  let mockAxiosInstance;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance = axios.create();
  });
  
  describe('scheduleApi', () => {
    it('should call getAll with correct endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });
      await scheduleApi.getAll();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/schedules');
    });
    
    it('should call getById with correct endpoint and ID', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });
      await scheduleApi.getById('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/schedules/123');
    });
    
    it('should call create with correct endpoint and data', async () => {
      const mockData = { name: 'Test Schedule' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockData });
      await scheduleApi.create(mockData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules', mockData);
    });
    
    it('should call update with correct endpoint, ID, and data', async () => {
      const mockData = { name: 'Updated Schedule' };
      mockAxiosInstance.put.mockResolvedValueOnce({ data: mockData });
      await scheduleApi.update('123', mockData);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/schedules/123', mockData);
    });
    
    it('should call delete with correct endpoint and ID', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: {} });
      await scheduleApi.delete('123');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/schedules/123');
    });
    
    it('should call activate with correct endpoint and ID', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: {} });
      await scheduleApi.activate('123');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules/123/activate');
    });
    
    it('should call deactivate with correct endpoint and ID', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: {} });
      await scheduleApi.deactivate('123');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules/123/deactivate');
    });
  });
  
  describe('analyticsApi', () => {
    it('should call getAllWithSuccessRates with correct endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });
      await analyticsApi.getAllWithSuccessRates();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules');
    });
    
    it('should call search with correct endpoint and search term', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });
      await analyticsApi.search('test');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules/search?term=test');
    });
    
    it('should call getSuccessRateStatistics with correct endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });
      await analyticsApi.getSuccessRateStatistics();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/success-rates');
    });
    
    it('should call getScheduleSuccessRate with correct endpoint and ID', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });
      await analyticsApi.getScheduleSuccessRate('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules/123/success-rate');
    });
  });
  
  describe('executionHistoryApi', () => {
    it('should call getAll with correct endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });
      await executionHistoryApi.getAll();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories');
    });
    
    it('should call getByScheduleId with correct endpoint and schedule ID', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });
      await executionHistoryApi.getByScheduleId('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories/schedule/123');
    });
    
    it('should call getById with correct endpoint and ID', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });
      await executionHistoryApi.getById('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories/123');
    });
    
    it('should handle API errors gracefully', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValueOnce(error);
      
      await expect(executionHistoryApi.getAll()).rejects.toThrow('Network Error');
    });
  });
});
