import { scheduleApi, executionHistoryApi, analyticsApi } from '../../../lib/api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleApi', () => {
    it('should call getAll correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [{ id: '1', name: 'Test Schedule' }] });
      
      const result = await scheduleApi.getAll();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/schedules');
      expect(result).toEqual({ data: [{ id: '1', name: 'Test Schedule' }] });
    });

    it('should call getById correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { id: '1', name: 'Test Schedule' } });
      
      const result = await scheduleApi.getById('1');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/schedules/1');
      expect(result).toEqual({ data: { id: '1', name: 'Test Schedule' } });
    });

    it('should call create correctly', async () => {
      const scheduleData = { name: 'New Schedule', cronExpression: '* * * * *' };
      mockedAxios.post.mockResolvedValueOnce({ data: { id: '1', ...scheduleData } });
      
      const result = await scheduleApi.create(scheduleData);
      
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/schedules', scheduleData);
      expect(result).toEqual({ data: { id: '1', ...scheduleData } });
    });

    it('should call update correctly', async () => {
      const scheduleData = { id: '1', name: 'Updated Schedule' };
      mockedAxios.put.mockResolvedValueOnce({ data: scheduleData });
      
      const result = await scheduleApi.update('1', scheduleData);
      
      expect(mockedAxios.put).toHaveBeenCalledWith('/api/schedules/1', scheduleData);
      expect(result).toEqual({ data: scheduleData });
    });

    it('should call delete correctly', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });
      
      const result = await scheduleApi.delete('1');
      
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/schedules/1');
      expect(result).toEqual({ data: { success: true } });
    });
  });

  describe('executionHistoryApi', () => {
    it('should call getAll correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [{ id: '1', scheduleId: '1' }] });
      
      const result = await executionHistoryApi.getAll();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/executions');
      expect(result).toEqual({ data: [{ id: '1', scheduleId: '1' }] });
    });

    it('should call getById correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { id: '1', scheduleId: '1' } });
      
      const result = await executionHistoryApi.getById('1');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/executions/1');
      expect(result).toEqual({ data: { id: '1', scheduleId: '1' } });
    });

    it('should call getByScheduleId correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [{ id: '1', scheduleId: '1' }] });
      
      const result = await executionHistoryApi.getByScheduleId('1');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/schedules/1/executions');
      expect(result).toEqual({ data: [{ id: '1', scheduleId: '1' }] });
    });
  });

  describe('analyticsApi', () => {
    it('should call getAllWithSuccessRates correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ 
        data: [{ id: '1', name: 'Test Schedule', successRate: 0.85 }] 
      });
      
      const result = await analyticsApi.getAllWithSuccessRates();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/analytics/schedules');
      expect(result).toEqual({ 
        data: [{ id: '1', name: 'Test Schedule', successRate: 0.85 }] 
      });
    });

    it('should call search correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ 
        data: [{ id: '1', name: 'Test Schedule', successRate: 0.85 }] 
      });
      
      const result = await analyticsApi.search('Test');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/analytics/schedules/search?query=Test');
      expect(result).toEqual({ 
        data: [{ id: '1', name: 'Test Schedule', successRate: 0.85 }] 
      });
    });

    it('should call getSuccessRateStats correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ 
        data: { 
          averageSuccessRate: 0.85, 
          highestSuccessRate: 1.0, 
          lowestSuccessRate: 0.5 
        } 
      });
      
      const result = await analyticsApi.getSuccessRateStatistics();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/analytics/success-rates');
      expect(result).toEqual({ 
        data: { 
          averageSuccessRate: 0.85, 
          highestSuccessRate: 1.0, 
          lowestSuccessRate: 0.5 
        } 
      });
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
      
      await expect(scheduleApi.getAll()).rejects.toThrow('Network Error');
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({ 
        response: { 
          status: 404, 
          data: { message: 'Not Found' } 
        } 
      });
      
      await expect(scheduleApi.getById('999')).rejects.toEqual({ 
        response: { 
          status: 404, 
          data: { message: 'Not Found' } 
        } 
      });
    });
  });
});
