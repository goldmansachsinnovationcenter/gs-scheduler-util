package com.scheduler.api.controller;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {
    
    private final ScheduleService scheduleService;
    private final ExecutionHistoryService executionHistoryService;
    
    /**
     * Get all schedules with their success rates.
     * 
     * @return List of schedules with success rates
     */
    @GetMapping("/schedules")
    public ResponseEntity<List<Map<String, Object>>> getAllSchedulesWithSuccessRates() {
        List<Schedule> schedules = scheduleService.getAllSchedules();
        
        List<Map<String, Object>> result = schedules.stream()
                .map(schedule -> {
                    Map<String, Object> scheduleWithRate = new HashMap<>();
                    scheduleWithRate.put("schedule", schedule);
                    scheduleWithRate.put("successRate", executionHistoryService.calculateSuccessRate(schedule.getId()));
                    return scheduleWithRate;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Search schedules with partial text search and include success rates.
     * 
     * @param term Search term
     * @return List of matching schedules with success rates
     */
    @GetMapping("/schedules/search")
    public ResponseEntity<List<Map<String, Object>>> searchSchedulesWithSuccessRates(@RequestParam String term) {
        List<Schedule> schedules = scheduleService.searchSchedules(term);
        
        List<Map<String, Object>> result = schedules.stream()
                .map(schedule -> {
                    Map<String, Object> scheduleWithRate = new HashMap<>();
                    scheduleWithRate.put("schedule", schedule);
                    scheduleWithRate.put("successRate", executionHistoryService.calculateSuccessRate(schedule.getId()));
                    return scheduleWithRate;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Get success rate statistics for all schedules.
     * 
     * @return Success rate statistics
     */
    @GetMapping("/success-rates")
    public ResponseEntity<Map<String, Object>> getSuccessRateStatistics() {
        List<Schedule> schedules = scheduleService.getAllSchedules();
        
        double overallSuccessRate = 0.0;
        int totalSchedules = schedules.size();
        
        if (totalSchedules > 0) {
            double totalSuccessRate = schedules.stream()
                    .mapToDouble(schedule -> executionHistoryService.calculateSuccessRate(schedule.getId()))
                    .sum();
            
            overallSuccessRate = totalSuccessRate / totalSchedules;
        }
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("overallSuccessRate", overallSuccessRate);
        statistics.put("totalSchedules", totalSchedules);
        
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get success rate for a specific schedule.
     * 
     * @param id Schedule ID
     * @return Success rate
     */
    @GetMapping("/schedules/{id}/success-rate")
    public ResponseEntity<Map<String, Double>> getScheduleSuccessRate(@PathVariable String id) {
        return scheduleService.getScheduleById(id)
                .map(schedule -> {
                    double successRate = executionHistoryService.calculateSuccessRate(schedule.getId());
                    return ResponseEntity.ok(Map.of("successRate", successRate));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
