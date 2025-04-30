package com.scheduler.api.service;

import com.scheduler.api.dto.ScheduleDTO;
import com.scheduler.api.model.ContactPerson;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.repository.ScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @InjectMocks
    private ScheduleService scheduleService;

    private Schedule schedule;
    private ScheduleDTO scheduleDTO;
    private List<ContactPerson> contactPersons;

    @BeforeEach
    void setUp() {
        contactPersons = Arrays.asList(
                new ContactPerson("John Doe", "john@example.com", "123-456-7890"),
                new ContactPerson("Jane Smith", "jane@example.com", "987-654-3210")
        );

        schedule = Schedule.builder()
                .id("1")
                .frequency("repetitive")
                .cronExpression("0 0 * * * ?")
                .dayOfWeek(1)
                .dayOfMonth(1)
                .weekOfMonth(1)
                .monthOfYear(1)
                .hourOfDay(0)
                .minuteOfHour(0)
                .httpMethod("GET")
                .payload(null)
                .workflowIdentifier("test-workflow")
                .shouldRetry(true)
                .maxRetries(3)
                .description("Test Schedule")
                .automationRequestId("AR123")
                .targetApplication("TestApp")
                .contactPersons(contactPersons)
                .communicationDL("test-dl@example.com")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .status("active")
                .build();

        scheduleDTO = ScheduleDTO.builder()
                .frequency("repetitive")
                .cronExpression("0 0 * * * ?")
                .dayOfWeek(1)
                .dayOfMonth(1)
                .weekOfMonth(1)
                .monthOfYear(1)
                .hourOfDay(0)
                .minuteOfHour(0)
                .httpMethod("GET")
                .payload(null)
                .workflowIdentifier("test-workflow")
                .shouldRetry(true)
                .maxRetries(3)
                .description("Test Schedule")
                .automationRequestId("AR123")
                .targetApplication("TestApp")
                .contactPersons(contactPersons)
                .communicationDL("test-dl@example.com")
                .build();
    }

    @Test
    void getAllSchedules_ShouldReturnAllSchedules() {
        List<Schedule> schedules = Arrays.asList(schedule);
        when(scheduleRepository.findAll()).thenReturn(schedules);

        List<Schedule> result = scheduleService.getAllSchedules();

        assertEquals(1, result.size());
        assertEquals(schedule.getId(), result.get(0).getId());
        verify(scheduleRepository, times(1)).findAll();
    }

    @Test
    void getScheduleById_ExistingId_ShouldReturnSchedule() {
        when(scheduleRepository.findById("1")).thenReturn(Optional.of(schedule));

        Optional<Schedule> result = scheduleService.getScheduleById("1");

        assertTrue(result.isPresent());
        assertEquals(schedule.getId(), result.get().getId());
        verify(scheduleRepository, times(1)).findById("1");
    }

    @Test
    void getScheduleById_NonExistingId_ShouldReturnEmpty() {
        when(scheduleRepository.findById("999")).thenReturn(Optional.empty());

        Optional<Schedule> result = scheduleService.getScheduleById("999");

        assertFalse(result.isPresent());
        verify(scheduleRepository, times(1)).findById("999");
    }

    @Test
    void searchSchedules_ShouldReturnMatchingSchedules() {
        List<Schedule> workflowMatches = Arrays.asList(schedule);
        List<Schedule> descriptionMatches = Arrays.asList();
        when(scheduleRepository.findByWorkflowIdentifierContaining("test")).thenReturn(workflowMatches);
        when(scheduleRepository.findByDescriptionContaining("test")).thenReturn(descriptionMatches);

        List<Schedule> result = scheduleService.searchSchedules("test");

        assertEquals(1, result.size());
        assertEquals(schedule.getId(), result.get(0).getId());
        verify(scheduleRepository, times(1)).findByWorkflowIdentifierContaining("test");
        verify(scheduleRepository, times(1)).findByDescriptionContaining("test");
    }

    @Test
    void createSchedule_ShouldCreateAndReturnSchedule() {
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation -> {
            Schedule savedSchedule = invocation.getArgument(0);
            savedSchedule.setId("1");
            return savedSchedule;
        });

        Schedule result = scheduleService.createSchedule(scheduleDTO);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals(scheduleDTO.getFrequency(), result.getFrequency());
        assertEquals(scheduleDTO.getWorkflowIdentifier(), result.getWorkflowIdentifier());
        assertEquals("active", result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        verify(scheduleRepository, times(1)).save(any(Schedule.class));
    }

    @Test
    void updateSchedule_ExistingId_ShouldUpdateAndReturnSchedule() {
        when(scheduleRepository.findById("1")).thenReturn(Optional.of(schedule));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Schedule> result = scheduleService.updateSchedule("1", scheduleDTO);

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getId());
        assertEquals(scheduleDTO.getFrequency(), result.get().getFrequency());
        assertEquals(scheduleDTO.getWorkflowIdentifier(), result.get().getWorkflowIdentifier());
        assertEquals(schedule.getStatus(), result.get().getStatus());
        assertEquals(schedule.getCreatedAt(), result.get().getCreatedAt());
        assertNotNull(result.get().getUpdatedAt());
        verify(scheduleRepository, times(1)).findById("1");
        verify(scheduleRepository, times(1)).save(any(Schedule.class));
    }

    @Test
    void updateSchedule_NonExistingId_ShouldReturnEmpty() {
        when(scheduleRepository.findById("999")).thenReturn(Optional.empty());

        Optional<Schedule> result = scheduleService.updateSchedule("999", scheduleDTO);

        assertFalse(result.isPresent());
        verify(scheduleRepository, times(1)).findById("999");
        verify(scheduleRepository, never()).save(any(Schedule.class));
    }

    @Test
    void deleteSchedule_ExistingId_ShouldReturnTrue() {
        when(scheduleRepository.existsById("1")).thenReturn(true);
        doNothing().when(scheduleRepository).deleteById("1");

        boolean result = scheduleService.deleteSchedule("1");

        assertTrue(result);
        verify(scheduleRepository, times(1)).existsById("1");
        verify(scheduleRepository, times(1)).deleteById("1");
    }

    @Test
    void deleteSchedule_NonExistingId_ShouldReturnFalse() {
        when(scheduleRepository.existsById("999")).thenReturn(false);

        boolean result = scheduleService.deleteSchedule("999");

        assertFalse(result);
        verify(scheduleRepository, times(1)).existsById("999");
        verify(scheduleRepository, never()).deleteById("999");
    }

    @Test
    void updateScheduleEntity_ExistingId_ShouldUpdateAndReturnSchedule() {
        when(scheduleRepository.findById("1")).thenReturn(Optional.of(schedule));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Schedule updatedSchedule = Schedule.builder()
                .frequency("once")
                .cronExpression("0 0 1 1 * ?")
                .workflowIdentifier("updated-workflow")
                .status("inactive")
                .build();

        Optional<Schedule> result = scheduleService.updateSchedule("1", updatedSchedule);

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getId());
        assertEquals(updatedSchedule.getFrequency(), result.get().getFrequency());
        assertEquals(updatedSchedule.getWorkflowIdentifier(), result.get().getWorkflowIdentifier());
        assertEquals(schedule.getCreatedAt(), result.get().getCreatedAt());
        assertNotNull(result.get().getUpdatedAt());
        verify(scheduleRepository, times(1)).findById("1");
        verify(scheduleRepository, times(1)).save(any(Schedule.class));
    }

    @Test
    void updateScheduleEntity_NonExistingId_ShouldReturnEmpty() {
        when(scheduleRepository.findById("999")).thenReturn(Optional.empty());

        Schedule updatedSchedule = Schedule.builder()
                .frequency("once")
                .cronExpression("0 0 1 1 * ?")
                .workflowIdentifier("updated-workflow")
                .status("inactive")
                .build();

        Optional<Schedule> result = scheduleService.updateSchedule("999", updatedSchedule);

        assertFalse(result.isPresent());
        verify(scheduleRepository, times(1)).findById("999");
        verify(scheduleRepository, never()).save(any(Schedule.class));
    }
}
