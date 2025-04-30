import axios from 'axios';
import { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.spyOn(axios, 'create').mockImplementation(() => {
  return {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    defaults: {
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  } as any;
});

describe('API Service Direct Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleApi', () => {
    it('should have all required methods', () => {
      expect(scheduleApi).toHaveProperty('getAll');
      expect(scheduleApi).toHaveProperty('getById');
      expect(scheduleApi).toHaveProperty('create');
      expect(scheduleApi).toHaveProperty('update');
      expect(scheduleApi).toHaveProperty('delete');
      expect(scheduleApi).toHaveProperty('activate');
      expect(scheduleApi).toHaveProperty('deactivate');
    });

    it('should return data from API calls', async () => {
      const mockData = { id: '123', name: 'Test Schedule' };
      const axiosInstance = axios.create();
      (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
      
      const result = await scheduleApi.getById('123');
      expect(result).toBeDefined();
    });
  });

  describe('analyticsApi', () => {
    it('should have all required methods', () => {
      expect(analyticsApi).toHaveProperty('getAllWithSuccessRates');
      expect(analyticsApi).toHaveProperty('search');
      expect(analyticsApi).toHaveProperty('getSuccessRateStatistics');
      expect(analyticsApi).toHaveProperty('getScheduleSuccessRate');
    });
  });

  describe('executionHistoryApi', () => {
    it('should have all required methods', () => {
      expect(executionHistoryApi).toHaveProperty('getAll');
      expect(executionHistoryApi).toHaveProperty('getByScheduleId');
      expect(executionHistoryApi).toHaveProperty('getById');
    });
  });
});
