import axios from 'axios';
import api, { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

const mockGet = jest.fn().mockResolvedValue({ data: {} });
const mockPost = jest.fn().mockResolvedValue({ data: {} });
const mockPut = jest.fn().mockResolvedValue({ data: {} });
const mockDelete = jest.fn().mockResolvedValue({ data: {} });

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    defaults: {
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })),
}));

describe('API Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleApi', () => {
    it('should call getAll with correct endpoint', async () => {
      await scheduleApi.getAll();
      expect(mockGet).toHaveBeenCalledWith('/schedules');
    });

    it('should call getById with correct endpoint and ID', async () => {
      await scheduleApi.getById('123');
      expect(mockGet).toHaveBeenCalledWith('/schedules/123');
    });

    it('should call create with correct endpoint and data', async () => {
      const mockData = { name: 'Test Schedule' };
      await scheduleApi.create(mockData);
      expect(mockPost).toHaveBeenCalledWith('/schedules', mockData);
    });

    it('should call update with correct endpoint, ID, and data', async () => {
      const mockData = { name: 'Updated Schedule' };
      await scheduleApi.update('123', mockData);
      expect(mockPut).toHaveBeenCalledWith('/schedules/123', mockData);
    });

    it('should call delete with correct endpoint and ID', async () => {
      await scheduleApi.delete('123');
      expect(mockDelete).toHaveBeenCalledWith('/schedules/123');
    });

    it('should call activate with correct endpoint and ID', async () => {
      await scheduleApi.activate('123');
      expect(mockPost).toHaveBeenCalledWith('/schedules/123/activate');
    });

    it('should call deactivate with correct endpoint and ID', async () => {
      await scheduleApi.deactivate('123');
      expect(mockPost).toHaveBeenCalledWith('/schedules/123/deactivate');
    });
  });

  describe('analyticsApi', () => {
    it('should call getAllWithSuccessRates with correct endpoint', async () => {
      await analyticsApi.getAllWithSuccessRates();
      expect(mockGet).toHaveBeenCalledWith('/analytics/schedules');
    });

    it('should call search with correct endpoint and search term', async () => {
      await analyticsApi.search('test');
      expect(mockGet).toHaveBeenCalledWith('/analytics/schedules/search?term=test');
    });

    it('should call getSuccessRateStatistics with correct endpoint', async () => {
      await analyticsApi.getSuccessRateStatistics();
      expect(mockGet).toHaveBeenCalledWith('/analytics/success-rates');
    });

    it('should call getScheduleSuccessRate with correct endpoint and ID', async () => {
      await analyticsApi.getScheduleSuccessRate('123');
      expect(mockGet).toHaveBeenCalledWith('/analytics/schedules/123/success-rate');
    });
  });

  describe('executionHistoryApi', () => {
    it('should call getAll with correct endpoint', async () => {
      await executionHistoryApi.getAll();
      expect(mockGet).toHaveBeenCalledWith('/execution-histories');
    });

    it('should call getByScheduleId with correct endpoint and schedule ID', async () => {
      await executionHistoryApi.getByScheduleId('123');
      expect(mockGet).toHaveBeenCalledWith('/execution-histories/schedule/123');
    });

    it('should call getById with correct endpoint and ID', async () => {
      await executionHistoryApi.getById('123');
      expect(mockGet).toHaveBeenCalledWith('/execution-histories/123');
    });
  });
});
