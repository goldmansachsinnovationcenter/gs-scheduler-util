package com.scheduler.api.service;

import com.scheduler.api.dto.ScheduleDTO;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    
    public Optional<Schedule> getScheduleById(String id) {
        return scheduleRepository.findById(id);
    }
    
    public List<Schedule> searchSchedules(String searchTerm) {
        List<Schedule> byWorkflow = scheduleRepository.findByWorkflowIdentifierContaining(searchTerm);
        List<Schedule> byDescription = scheduleRepository.findByDescriptionContaining(searchTerm);
        
        byWorkflow.addAll(byDescription);
        return byWorkflow.stream().distinct().toList();
    }
    
    public Schedule createSchedule(ScheduleDTO scheduleDTO) {
        Schedule schedule = mapDtoToEntity(scheduleDTO);
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setUpdatedAt(LocalDateTime.now());
        schedule.setStatus("active");
        
        return scheduleRepository.save(schedule);
    }
    
    public Optional<Schedule> updateSchedule(String id, ScheduleDTO scheduleDTO) {
        return scheduleRepository.findById(id)
                .map(existingSchedule -> {
                    Schedule updatedSchedule = mapDtoToEntity(scheduleDTO);
                    updatedSchedule.setId(existingSchedule.getId());
                    updatedSchedule.setCreatedAt(existingSchedule.getCreatedAt());
                    updatedSchedule.setUpdatedAt(LocalDateTime.now());
                    updatedSchedule.setStatus(existingSchedule.getStatus());
                    
                    return scheduleRepository.save(updatedSchedule);
                });
    }
    
    public boolean deleteSchedule(String id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public Optional<Schedule> updateSchedule(String id, Schedule schedule) {
        return scheduleRepository.findById(id)
                .map(existingSchedule -> {
                    schedule.setId(existingSchedule.getId());
                    schedule.setCreatedAt(existingSchedule.getCreatedAt());
                    schedule.setUpdatedAt(LocalDateTime.now());
                    
                    return scheduleRepository.save(schedule);
                });
    }
    
    private Schedule mapDtoToEntity(ScheduleDTO dto) {
        return Schedule.builder()
                .frequency(dto.getFrequency())
                .cronExpression(dto.getCronExpression())
                .dayOfWeek(dto.getDayOfWeek())
                .dayOfMonth(dto.getDayOfMonth())
                .weekOfMonth(dto.getWeekOfMonth())
                .monthOfYear(dto.getMonthOfYear())
                .hourOfDay(dto.getHourOfDay())
                .minuteOfHour(dto.getMinuteOfHour())
                .httpMethod(dto.getHttpMethod())
                .payload(dto.getPayload())
                .workflowIdentifier(dto.getWorkflowIdentifier())
                .shouldRetry(dto.getShouldRetry())
                .maxRetries(dto.getMaxRetries())
                .description(dto.getDescription())
                .automationRequestId(dto.getAutomationRequestId())
                .targetApplication(dto.getTargetApplication())
                .contactPersons(dto.getContactPersons())
                .communicationDL(dto.getCommunicationDL())
                .build();
    }
}
