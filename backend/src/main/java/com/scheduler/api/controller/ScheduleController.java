package com.scheduler.api.controller;

import com.scheduler.api.dto.ScheduleDTO;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.service.CronExpressionService;
import com.scheduler.api.service.ScheduleService;
import com.scheduler.api.service.SchedulerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    private final SchedulerService schedulerService;
    private final CronExpressionService cronExpressionService;
    
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable String id) {
        return scheduleService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Schedule>> searchSchedules(@RequestParam String term) {
        return ResponseEntity.ok(scheduleService.searchSchedules(term));
    }
    
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO) {
        if (scheduleDTO.getCronExpression() == null || scheduleDTO.getCronExpression().isEmpty()) {
            String cronExpression = cronExpressionService.generateCronExpression(
                    scheduleDTO.getFrequency(),
                    scheduleDTO.getMinuteOfHour(),
                    scheduleDTO.getHourOfDay(),
                    scheduleDTO.getDayOfMonth(),
                    scheduleDTO.getMonthOfYear(),
                    scheduleDTO.getDayOfWeek()
            );
            scheduleDTO.setCronExpression(cronExpression);
        }
        
        if (!cronExpressionService.isValidCronExpression(scheduleDTO.getCronExpression())) {
            return ResponseEntity.badRequest().build();
        }
        
        Schedule createdSchedule = scheduleService.createSchedule(scheduleDTO);
        
        schedulerService.scheduleTask(createdSchedule);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(
            @PathVariable String id,
            @Valid @RequestBody ScheduleDTO scheduleDTO) {
        
        if (scheduleDTO.getCronExpression() == null || scheduleDTO.getCronExpression().isEmpty()) {
            String cronExpression = cronExpressionService.generateCronExpression(
                    scheduleDTO.getFrequency(),
                    scheduleDTO.getMinuteOfHour(),
                    scheduleDTO.getHourOfDay(),
                    scheduleDTO.getDayOfMonth(),
                    scheduleDTO.getMonthOfYear(),
                    scheduleDTO.getDayOfWeek()
            );
            scheduleDTO.setCronExpression(cronExpression);
        }
        
        if (!cronExpressionService.isValidCronExpression(scheduleDTO.getCronExpression())) {
            return ResponseEntity.badRequest().build();
        }
        
        return scheduleService.updateSchedule(id, scheduleDTO)
                .map(updatedSchedule -> {
                    schedulerService.scheduleTask(updatedSchedule);
                    return ResponseEntity.ok(updatedSchedule);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String id) {
        if (scheduleService.deleteSchedule(id)) {
            schedulerService.cancelTask(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/activate")
    public ResponseEntity<Map<String, Boolean>> activateSchedule(@PathVariable String id) {
        return scheduleService.getScheduleById(id)
                .map(schedule -> {
                    schedule.setStatus("active");
                    scheduleService.updateSchedule(id, schedule);
                    boolean scheduled = schedulerService.scheduleTask(schedule);
                    return ResponseEntity.ok(Map.of("activated", scheduled));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Boolean>> deactivateSchedule(@PathVariable String id) {
        return scheduleService.getScheduleById(id)
                .map(schedule -> {
                    schedule.setStatus("inactive");
                    scheduleService.updateSchedule(id, schedule);
                    boolean cancelled = schedulerService.cancelTask(id);
                    return ResponseEntity.ok(Map.of("deactivated", cancelled));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/validate-cron")
    public ResponseEntity<Map<String, Boolean>> validateCronExpression(@RequestBody Map<String, String> request) {
        String cronExpression = request.get("cronExpression");
        boolean isValid = cronExpressionService.isValidCronExpression(cronExpression);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }
}
