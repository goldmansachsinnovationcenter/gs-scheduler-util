import axios from 'axios';
import api, { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('axios', () => {
  type MockAxiosType = {
    create: jest.Mock;
    defaults: {
      baseURL: string;
      headers: {
        'Content-Type': string;
      };
    };
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
  };

  const mockAxios: MockAxiosType = {
    create: jest.fn().mockReturnThis(),
    defaults: {
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} })
  };
  return mockAxios;
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('api instance', () => {
    it('should be configured with the correct base URL', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:8080/api');
    });

    it('should have the correct headers', () => {
      expect(api.defaults.headers).toHaveProperty('Content-Type', 'application/json');
    });
  });

  describe('scheduleApi', () => {
    it('should call getAll with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await scheduleApi.getAll();
      expect(mockedAxios.get).toHaveBeenCalledWith('/schedules');
    });

    it('should call getById with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: {} });

      await scheduleApi.getById('123');
      expect(mockedAxios.get).toHaveBeenCalledWith('/schedules/123');
    });

    it('should call create with the correct endpoint and data', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      const mockData = { name: 'Test Schedule' };
      await scheduleApi.create(mockData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/schedules', mockData);
    });

    it('should call update with the correct endpoint and data', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.put.mockResolvedValueOnce({ data: {} });

      const mockData = { name: 'Updated Schedule' };
      await scheduleApi.update('123', mockData);
      expect(mockedAxios.put).toHaveBeenCalledWith('/schedules/123', mockData);
    });

    it('should call delete with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.delete.mockResolvedValueOnce({ data: {} });

      await scheduleApi.delete('123');
      expect(mockedAxios.delete).toHaveBeenCalledWith('/schedules/123');
    });

    it('should call activate with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await scheduleApi.activate('123');
      expect(mockedAxios.post).toHaveBeenCalledWith('/schedules/123/activate');
    });

    it('should call deactivate with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await scheduleApi.deactivate('123');
      expect(mockedAxios.post).toHaveBeenCalledWith('/schedules/123/deactivate');
    });
  });

  describe('analyticsApi', () => {
    it('should call getAllWithSuccessRates with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await analyticsApi.getAllWithSuccessRates();
      expect(mockedAxios.get).toHaveBeenCalledWith('/analytics/schedules');
    });

    it('should call search with the correct endpoint and term', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await analyticsApi.search('test');
      expect(mockedAxios.get).toHaveBeenCalledWith('/analytics/schedules/search?term=test');
    });

    it('should call getSuccessRateStatistics with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: {} });

      await analyticsApi.getSuccessRateStatistics();
      expect(mockedAxios.get).toHaveBeenCalledWith('/analytics/success-rates');
    });

    it('should call getScheduleSuccessRate with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: {} });

      await analyticsApi.getScheduleSuccessRate('123');
      expect(mockedAxios.get).toHaveBeenCalledWith('/analytics/schedules/123/success-rate');
    });
  });

  describe('executionHistoryApi', () => {
    it('should call getAll with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await executionHistoryApi.getAll();
      expect(mockedAxios.get).toHaveBeenCalledWith('/execution-histories');
    });

    it('should call getByScheduleId with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await executionHistoryApi.getByScheduleId('123');
      expect(mockedAxios.get).toHaveBeenCalledWith('/execution-histories/schedule/123');
    });

    it('should call getById with the correct endpoint', async () => {
      mockedAxios.create.mockReturnValue(mockedAxios);
      mockedAxios.get.mockResolvedValueOnce({ data: {} });

      await executionHistoryApi.getById('123');
      expect(mockedAxios.get).toHaveBeenCalledWith('/execution-histories/123');
    });
  });
});
