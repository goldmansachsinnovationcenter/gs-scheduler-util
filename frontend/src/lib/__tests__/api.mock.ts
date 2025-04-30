import { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('../api', () => ({
  scheduleApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
  },
  analyticsApi: {
    getAllWithSuccessRates: jest.fn(),
    search: jest.fn(),
    getSuccessRateStatistics: jest.fn(),
    getScheduleSuccessRate: jest.fn(),
  },
  executionHistoryApi: {
    getAll: jest.fn(),
    getByScheduleId: jest.fn(),
    getById: jest.fn(),
  },
}));

export { scheduleApi, analyticsApi, executionHistoryApi };
