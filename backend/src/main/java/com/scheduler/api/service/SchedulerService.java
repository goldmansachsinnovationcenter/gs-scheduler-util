package com.scheduler.api.service;

import com.scheduler.api.model.ExecutionHistory;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.repository.ExecutionHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final TaskScheduler taskScheduler;
    private final ExecutionHistoryRepository executionHistoryRepository;
    private final RestTemplate restTemplate;
    
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    
    /**
     * Schedules a task based on the provided schedule.
     * 
     * @param schedule The schedule to use
     * @return true if scheduled successfully, false otherwise
     */
    public boolean scheduleTask(Schedule schedule) {
        try {
            cancelTask(schedule.getId());
            
            ScheduledFuture<?> future = taskScheduler.schedule(
                    () -> executeTask(schedule),
                    new CronTrigger(schedule.getCronExpression())
            );
            
            scheduledTasks.put(schedule.getId(), future);
            
            log.info("Scheduled task for schedule ID: {}", schedule.getId());
            return true;
        } catch (Exception e) {
            log.error("Failed to schedule task for schedule ID: {}", schedule.getId(), e);
            return false;
        }
    }
    
    /**
     * Cancels a scheduled task.
     * 
     * @param scheduleId The ID of the schedule
     * @return true if cancelled successfully, false otherwise
     */
    public boolean cancelTask(String scheduleId) {
        ScheduledFuture<?> future = scheduledTasks.get(scheduleId);
        if (future != null) {
            future.cancel(false);
            scheduledTasks.remove(scheduleId);
            log.info("Cancelled task for schedule ID: {}", scheduleId);
            return true;
        }
        return false;
    }
    
    /**
     * Executes a task based on the provided schedule.
     * 
     * @param schedule The schedule to execute
     */
    void executeTask(Schedule schedule) {
        log.info("Executing task for schedule ID: {}", schedule.getId());
        
        ExecutionHistory executionHistory = ExecutionHistory.builder()
                .scheduleId(schedule.getId())
                .executionTime(LocalDateTime.now())
                .status("running")
                .retryCount(0)
                .build();
        
        executionHistory = executionHistoryRepository.save(executionHistory);
        
        try {
            String url = "https://abc.bcp.com/execute/workflow/" + schedule.getWorkflowIdentifier();
            String response;
            
            if ("GET".equalsIgnoreCase(schedule.getHttpMethod())) {
                response = restTemplate.getForObject(url, String.class);
            } else {
                response = restTemplate.postForObject(url, schedule.getPayload(), String.class);
            }
            
            executionHistory.setResponseUrl(url);
            executionHistory.setStatus("success");
            executionHistoryRepository.save(executionHistory);
            
            log.info("Task executed successfully for schedule ID: {}", schedule.getId());
        } catch (Exception e) {
            log.error("Failed to execute task for schedule ID: {}", schedule.getId(), e);
            
            executionHistory.setStatus("failed");
            executionHistory.setErrorMessage(e.getMessage());
            executionHistoryRepository.save(executionHistory);
            
            if (schedule.getShouldRetry() && 
                    (executionHistory.getRetryCount() == null || 
                     executionHistory.getRetryCount() < schedule.getMaxRetries())) {
                
                retryExecution(schedule, executionHistory);
            }
        }
    }
    
    /**
     * Retries the execution of a task.
     * 
     * @param schedule The schedule to execute
     * @param executionHistory The execution history to update
     */
    private void retryExecution(Schedule schedule, ExecutionHistory executionHistory) {
        int retryCount = executionHistory.getRetryCount() != null ? executionHistory.getRetryCount() : 0;
        retryCount++;
        
        log.info("Retrying task for schedule ID: {} (attempt {})", schedule.getId(), retryCount);
        
        executionHistory.setRetryCount(retryCount);
        executionHistory.setStatus("retrying");
        executionHistoryRepository.save(executionHistory);
        
        taskScheduler.schedule(() -> executeTask(schedule), 
                java.time.Instant.now().plusSeconds(60));
    }
}
