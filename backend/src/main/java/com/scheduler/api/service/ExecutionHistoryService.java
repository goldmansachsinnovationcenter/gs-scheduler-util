package com.scheduler.api.service;

import com.scheduler.api.model.ExecutionHistory;
import com.scheduler.api.repository.ExecutionHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExecutionHistoryService {
    
    private final ExecutionHistoryRepository executionHistoryRepository;
    
    public List<ExecutionHistory> getAllExecutionHistories() {
        return executionHistoryRepository.findAll();
    }
    
    public List<ExecutionHistory> getExecutionHistoriesByScheduleId(String scheduleId) {
        return executionHistoryRepository.findByScheduleId(scheduleId);
    }
    
    public Optional<ExecutionHistory> getExecutionHistoryById(String id) {
        return executionHistoryRepository.findById(id);
    }
    
    public ExecutionHistory saveExecutionHistory(ExecutionHistory executionHistory) {
        return executionHistoryRepository.save(executionHistory);
    }
    
    public ExecutionHistory createExecutionHistory(ExecutionHistory executionHistory) {
        return executionHistoryRepository.save(executionHistory);
    }
    
    public Optional<ExecutionHistory> updateExecutionHistory(String id, ExecutionHistory executionHistory) {
        return executionHistoryRepository.findById(id)
                .map(existingHistory -> {
                    executionHistory.setId(id);
                    return executionHistoryRepository.save(executionHistory);
                });
    }
    
    public boolean deleteExecutionHistory(String id) {
        if (executionHistoryRepository.existsById(id)) {
            executionHistoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<ExecutionHistory> getExecutionHistoriesByStatus(String status) {
        return executionHistoryRepository.findByStatus(status);
    }
    
    public double calculateSuccessRate(String scheduleId) {
        List<ExecutionHistory> allExecutions = executionHistoryRepository.findByScheduleId(scheduleId);
        if (allExecutions.isEmpty()) {
            return 0.0;
        }
        
        long successfulExecutions = allExecutions.stream()
                .filter(execution -> "success".equalsIgnoreCase(execution.getStatus()))
                .count();
        
        return (double) successfulExecutions / allExecutions.size() * 100;
    }
}
