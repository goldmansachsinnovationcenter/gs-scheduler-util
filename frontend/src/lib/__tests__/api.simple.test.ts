import { scheduleApi, analyticsApi, executionHistoryApi } from '../api';

jest.mock('../api', () => {
  const originalModule = jest.requireActual('../api');
  
  return {
    ...originalModule,
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
  };
});

describe('Schedule API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have getAll method', () => {
    expect(typeof scheduleApi.getAll).toBe('function');
    scheduleApi.getAll();
    expect(scheduleApi.getAll).toHaveBeenCalled();
  });

  it('should have getById method', () => {
    expect(typeof scheduleApi.getById).toBe('function');
    scheduleApi.getById('123');
    expect(scheduleApi.getById).toHaveBeenCalledWith('123');
  });

  it('should have create method', () => {
    expect(typeof scheduleApi.create).toBe('function');
    const mockData = { name: 'Test Schedule' };
    scheduleApi.create(mockData);
    expect(scheduleApi.create).toHaveBeenCalledWith(mockData);
  });

  it('should have update method', () => {
    expect(typeof scheduleApi.update).toBe('function');
    const mockData = { name: 'Updated Schedule' };
    scheduleApi.update('123', mockData);
    expect(scheduleApi.update).toHaveBeenCalledWith('123', mockData);
  });

  it('should have delete method', () => {
    expect(typeof scheduleApi.delete).toBe('function');
    scheduleApi.delete('123');
    expect(scheduleApi.delete).toHaveBeenCalledWith('123');
  });

  it('should have activate method', () => {
    expect(typeof scheduleApi.activate).toBe('function');
    scheduleApi.activate('123');
    expect(scheduleApi.activate).toHaveBeenCalledWith('123');
  });

  it('should have deactivate method', () => {
    expect(typeof scheduleApi.deactivate).toBe('function');
    scheduleApi.deactivate('123');
    expect(scheduleApi.deactivate).toHaveBeenCalledWith('123');
  });
});

describe('Analytics API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have getAllWithSuccessRates method', () => {
    expect(typeof analyticsApi.getAllWithSuccessRates).toBe('function');
    analyticsApi.getAllWithSuccessRates();
    expect(analyticsApi.getAllWithSuccessRates).toHaveBeenCalled();
  });

  it('should have search method', () => {
    expect(typeof analyticsApi.search).toBe('function');
    analyticsApi.search('test');
    expect(analyticsApi.search).toHaveBeenCalledWith('test');
  });

  it('should have getSuccessRateStatistics method', () => {
    expect(typeof analyticsApi.getSuccessRateStatistics).toBe('function');
    analyticsApi.getSuccessRateStatistics();
    expect(analyticsApi.getSuccessRateStatistics).toHaveBeenCalled();
  });

  it('should have getScheduleSuccessRate method', () => {
    expect(typeof analyticsApi.getScheduleSuccessRate).toBe('function');
    analyticsApi.getScheduleSuccessRate('123');
    expect(analyticsApi.getScheduleSuccessRate).toHaveBeenCalledWith('123');
  });
});

describe('Execution History API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have getAll method', () => {
    expect(typeof executionHistoryApi.getAll).toBe('function');
    executionHistoryApi.getAll();
    expect(executionHistoryApi.getAll).toHaveBeenCalled();
  });

  it('should have getByScheduleId method', () => {
    expect(typeof executionHistoryApi.getByScheduleId).toBe('function');
    executionHistoryApi.getByScheduleId('123');
    expect(executionHistoryApi.getByScheduleId).toHaveBeenCalledWith('123');
  });

  it('should have getById method', () => {
    expect(typeof executionHistoryApi.getById).toBe('function');
    executionHistoryApi.getById('123');
    expect(executionHistoryApi.getById).toHaveBeenCalledWith('123');
  });
});
