import axios from 'axios';
import api, { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => mockAxiosInstance)
  };
});

const mockAxiosInstance = {
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
};

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Configuration', () => {
    it('should create axios instance with correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Schedule API', () => {
    it('should call getAll with correct endpoint', () => {
      scheduleApi.getAll();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/schedules');
    });

    it('should call getById with correct endpoint and ID', () => {
      scheduleApi.getById('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/schedules/123');
    });

    it('should call create with correct endpoint and data', () => {
      const mockData = { name: 'Test Schedule' };
      scheduleApi.create(mockData);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules', mockData);
    });

    it('should call update with correct endpoint, ID, and data', () => {
      const mockData = { name: 'Updated Schedule' };
      scheduleApi.update('123', mockData);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/schedules/123', mockData);
    });

    it('should call delete with correct endpoint and ID', () => {
      scheduleApi.delete('123');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/schedules/123');
    });

    it('should call activate with correct endpoint and ID', () => {
      scheduleApi.activate('123');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules/123/activate');
    });

    it('should call deactivate with correct endpoint and ID', () => {
      scheduleApi.deactivate('123');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/schedules/123/deactivate');
    });
  });

  describe('Analytics API', () => {
    it('should call getAllWithSuccessRates with correct endpoint', () => {
      analyticsApi.getAllWithSuccessRates();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules');
    });

    it('should call search with correct endpoint and search term', () => {
      analyticsApi.search('test');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules/search?term=test');
    });

    it('should call getSuccessRateStatistics with correct endpoint', () => {
      analyticsApi.getSuccessRateStatistics();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/success-rates');
    });

    it('should call getScheduleSuccessRate with correct endpoint and ID', () => {
      analyticsApi.getScheduleSuccessRate('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analytics/schedules/123/success-rate');
    });
  });

  describe('Execution History API', () => {
    it('should call getAll with correct endpoint', () => {
      executionHistoryApi.getAll();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories');
    });

    it('should call getByScheduleId with correct endpoint and schedule ID', () => {
      executionHistoryApi.getByScheduleId('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories/schedule/123');
    });

    it('should call getById with correct endpoint and ID', () => {
      executionHistoryApi.getById('123');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/execution-histories/123');
    });
  });
});
