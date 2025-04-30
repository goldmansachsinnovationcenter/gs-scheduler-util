package com.scheduler.api.controller;

import com.scheduler.api.dto.ExecutionHistoryDTO;
import com.scheduler.api.model.ExecutionHistory;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.service.ExecutionHistoryService;
import com.scheduler.api.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/execution-history")
@RequiredArgsConstructor
@Slf4j
public class ExecutionHistoryController {
    
    private final ExecutionHistoryService executionHistoryService;
    private final ScheduleService scheduleService;
    
    /**
     * Get all execution histories.
     * 
     * @return List of all execution histories
     */
    @GetMapping
    public ResponseEntity<List<ExecutionHistory>> getAllExecutionHistories() {
        return ResponseEntity.ok(executionHistoryService.getAllExecutionHistories());
    }
    
    /**
     * Get execution history by ID.
     * 
     * @param id Execution history ID
     * @return Execution history
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExecutionHistory> getExecutionHistoryById(@PathVariable String id) {
        return executionHistoryService.getExecutionHistoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get execution histories by schedule ID.
     * 
     * @param scheduleId Schedule ID
     * @return List of execution histories for the schedule
     */
    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<ExecutionHistory>> getExecutionHistoriesByScheduleId(
            @PathVariable String scheduleId) {
        return ResponseEntity.ok(executionHistoryService.getExecutionHistoriesByScheduleId(scheduleId));
    }
    
    /**
     * Get success rate for a schedule.
     * 
     * @param scheduleId Schedule ID
     * @return Success rate
     */
    @GetMapping("/schedule/{scheduleId}/success-rate")
    public ResponseEntity<Map<String, Double>> getSuccessRate(@PathVariable String scheduleId) {
        double successRate = executionHistoryService.calculateSuccessRate(scheduleId);
        return ResponseEntity.ok(Map.of("successRate", successRate));
    }
    
    /**
     * Get detailed execution history for a schedule.
     * 
     * @param scheduleId Schedule ID
     * @return Detailed execution history
     */
    @GetMapping("/schedule/{scheduleId}/detailed")
    public ResponseEntity<Map<String, Object>> getDetailedExecutionHistory(@PathVariable String scheduleId) {
        return scheduleService.getScheduleById(scheduleId)
                .map(schedule -> {
                    Map<String, Object> result = new HashMap<>();
                    
                    result.put("schedule", schedule);
                    
                    List<ExecutionHistory> executions = executionHistoryService.getExecutionHistoriesByScheduleId(scheduleId);
                    result.put("executions", executions);
                    
                    double successRate = executionHistoryService.calculateSuccessRate(scheduleId);
                    result.put("successRate", successRate);
                    
                    return ResponseEntity.ok(result);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get execution histories by status.
     * 
     * @param status Status
     * @return List of execution histories with the given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ExecutionHistory>> getExecutionHistoriesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(executionHistoryService.getExecutionHistoriesByStatus(status));
    }
    
    /**
     * Get execution histories with schedule details.
     * 
     * @return List of execution histories with schedule details
     */
    @GetMapping("/with-schedule-details")
    public ResponseEntity<List<Map<String, Object>>> getExecutionHistoriesWithScheduleDetails() {
        List<ExecutionHistory> executions = executionHistoryService.getAllExecutionHistories();
        
        List<Map<String, Object>> result = executions.stream()
                .map(execution -> {
                    Map<String, Object> executionWithSchedule = new HashMap<>();
                    executionWithSchedule.put("execution", execution);
                    
                    scheduleService.getScheduleById(execution.getScheduleId())
                            .ifPresent(schedule -> executionWithSchedule.put("schedule", schedule));
                    
                    return executionWithSchedule;
                })
                .toList();
        
        return ResponseEntity.ok(result);
    }
}
