package com.scheduler.api.service;

import com.scheduler.api.model.ExecutionHistory;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.repository.ExecutionHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.concurrent.ScheduledFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchedulerServiceTest {

    @Mock
    private TaskScheduler taskScheduler;

    @Mock
    private ExecutionHistoryRepository executionHistoryRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ScheduledFuture<?> scheduledFuture;

    @InjectMocks
    private SchedulerService schedulerService;

    @Captor
    private ArgumentCaptor<Runnable> runnableCaptor;

    @Captor
    private ArgumentCaptor<CronTrigger> triggerCaptor;

    @Captor
    private ArgumentCaptor<ExecutionHistory> executionHistoryCaptor;

    private Schedule schedule;

    @BeforeEach
    void setUp() {
        schedule = Schedule.builder()
                .id("1")
                .frequency("repetitive")
                .cronExpression("0 0 * * * ?")
                .httpMethod("GET")
                .workflowIdentifier("test-workflow")
                .shouldRetry(true)
                .maxRetries(3)
                .build();
    }

    @Test
    void scheduleTask_Success_ShouldReturnTrue() {
        when(taskScheduler.schedule(any(Runnable.class), any(CronTrigger.class))).thenReturn((ScheduledFuture) scheduledFuture);

        boolean result = schedulerService.scheduleTask(schedule);

        assertTrue(result);
        verify(taskScheduler).schedule(runnableCaptor.capture(), triggerCaptor.capture());
        assertEquals(schedule.getCronExpression(), triggerCaptor.getValue().getExpression());
    }

    @Test
    void scheduleTask_Exception_ShouldReturnFalse() {
        when(taskScheduler.schedule(any(Runnable.class), any(CronTrigger.class))).thenThrow(new RuntimeException("Test exception"));

        boolean result = schedulerService.scheduleTask(schedule);

        assertFalse(result);
        verify(taskScheduler).schedule(any(Runnable.class), any(CronTrigger.class));
    }

    @Test
    void cancelTask_ExistingTask_ShouldReturnTrue() {
        when(taskScheduler.schedule(any(Runnable.class), any(CronTrigger.class))).thenReturn((ScheduledFuture) scheduledFuture);
        schedulerService.scheduleTask(schedule);

        boolean result = schedulerService.cancelTask(schedule.getId());

        assertTrue(result);
        verify(scheduledFuture).cancel(false);
    }

    @Test
    void cancelTask_NonExistingTask_ShouldReturnFalse() {
        boolean result = schedulerService.cancelTask("non-existing-id");

        assertFalse(result);
        verify(scheduledFuture, never()).cancel(anyBoolean());
    }

    @Test
    void executeTask_GetRequest_Success_ShouldUpdateExecutionHistory() {
        ExecutionHistory executionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId(schedule.getId())
                .build();
        
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn("Success response");

        schedulerService.executeTask(schedule);

        verify(executionHistoryRepository, times(2)).save(executionHistoryCaptor.capture());
        
        ExecutionHistory initialHistory = executionHistoryCaptor.getAllValues().get(0);
        assertEquals(schedule.getId(), initialHistory.getScheduleId());
        assertEquals("running", initialHistory.getStatus());
        
        ExecutionHistory updatedHistory = executionHistoryCaptor.getAllValues().get(1);
        assertEquals("success", updatedHistory.getStatus());
        assertTrue(updatedHistory.getResponseUrl().contains(schedule.getWorkflowIdentifier()));
    }

    @Test
    void executeTask_PostRequest_Success_ShouldUpdateExecutionHistory() {
        schedule.setHttpMethod("POST");
        schedule.setPayload("{\"key\":\"value\"}");
        
        ExecutionHistory executionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId(schedule.getId())
                .build();
        
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);
        when(restTemplate.postForObject(anyString(), anyString(), eq(String.class))).thenReturn("Success response");

        schedulerService.executeTask(schedule);

        verify(executionHistoryRepository, times(2)).save(executionHistoryCaptor.capture());
        
        ExecutionHistory updatedHistory = executionHistoryCaptor.getAllValues().get(1);
        assertEquals("success", updatedHistory.getStatus());
        assertTrue(updatedHistory.getResponseUrl().contains(schedule.getWorkflowIdentifier()));
    }

    @Test
    void executeTask_Failure_NoRetry_ShouldUpdateExecutionHistory() {
        schedule.setShouldRetry(false);
        
        ExecutionHistory executionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId(schedule.getId())
                .build();
        
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenThrow(new RestClientException("Test exception"));

        schedulerService.executeTask(schedule);

        verify(executionHistoryRepository, times(2)).save(executionHistoryCaptor.capture());
        
        ExecutionHistory updatedHistory = executionHistoryCaptor.getAllValues().get(1);
        assertEquals("failed", updatedHistory.getStatus());
        assertEquals("Test exception", updatedHistory.getErrorMessage());
    }

    @Test
    void executeTask_Failure_WithRetry_ShouldRetryExecution() {
        ExecutionHistory executionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId(schedule.getId())
                .retryCount(0)
                .build();
        
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenThrow(new RestClientException("Test exception"));
        when(taskScheduler.schedule(any(Runnable.class), any(Instant.class))).thenReturn((ScheduledFuture) scheduledFuture);

        schedulerService.executeTask(schedule);

        verify(executionHistoryRepository, times(3)).save(executionHistoryCaptor.capture());
        
        ExecutionHistory retryHistory = executionHistoryCaptor.getAllValues().get(2);
        assertEquals("retrying", retryHistory.getStatus());
        assertEquals(1, retryHistory.getRetryCount());
        
        verify(taskScheduler).schedule(any(Runnable.class), any(Instant.class));
    }

    @Test
    void executeTask_Failure_MaxRetriesReached_ShouldNotRetry() {
        ExecutionHistory executionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId(schedule.getId())
                .retryCount(3) // Already at max retries
                .build();
        
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenThrow(new RestClientException("Test exception"));

        schedulerService.executeTask(schedule);

        verify(executionHistoryRepository, times(2)).save(executionHistoryCaptor.capture());
        
        ExecutionHistory updatedHistory = executionHistoryCaptor.getAllValues().get(1);
        assertEquals("failed", updatedHistory.getStatus());
        
        verify(taskScheduler, never()).schedule(any(Runnable.class), any(Instant.class));
    }
}
