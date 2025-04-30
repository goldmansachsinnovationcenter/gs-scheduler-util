package com.scheduler.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scheduler.api.dto.ScheduleDTO;
import com.scheduler.api.model.ContactPerson;
import com.scheduler.api.model.Schedule;
import com.scheduler.api.service.CronExpressionService;
import com.scheduler.api.service.ScheduleService;
import com.scheduler.api.service.SchedulerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleController.class)
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ScheduleService scheduleService;

    @MockBean
    private SchedulerService schedulerService;

    @MockBean
    private CronExpressionService cronExpressionService;

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
    void getAllSchedules_ShouldReturnAllSchedules() throws Exception {
        List<Schedule> schedules = Arrays.asList(schedule);
        when(scheduleService.getAllSchedules()).thenReturn(schedules);

        mockMvc.perform(get("/api/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(schedule.getId())))
                .andExpect(jsonPath("$[0].workflowIdentifier", is(schedule.getWorkflowIdentifier())));

        verify(scheduleService, times(1)).getAllSchedules();
    }

    @Test
    void getScheduleById_ExistingId_ShouldReturnSchedule() throws Exception {
        when(scheduleService.getScheduleById("1")).thenReturn(Optional.of(schedule));

        mockMvc.perform(get("/api/schedules/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(schedule.getId())))
                .andExpect(jsonPath("$.workflowIdentifier", is(schedule.getWorkflowIdentifier())));

        verify(scheduleService, times(1)).getScheduleById("1");
    }

    @Test
    void getScheduleById_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(scheduleService.getScheduleById("999")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/schedules/999"))
                .andExpect(status().isNotFound());

        verify(scheduleService, times(1)).getScheduleById("999");
    }

    @Test
    void searchSchedules_ShouldReturnMatchingSchedules() throws Exception {
        List<Schedule> schedules = Arrays.asList(schedule);
        when(scheduleService.searchSchedules("test")).thenReturn(schedules);

        mockMvc.perform(get("/api/schedules/search").param("term", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(schedule.getId())))
                .andExpect(jsonPath("$[0].workflowIdentifier", is(schedule.getWorkflowIdentifier())));

        verify(scheduleService, times(1)).searchSchedules("test");
    }

    @Test
    void createSchedule_WithCronExpression_ShouldCreateAndReturnSchedule() throws Exception {
        when(cronExpressionService.isValidCronExpression(anyString())).thenReturn(true);
        when(scheduleService.createSchedule(any(ScheduleDTO.class))).thenReturn(schedule);
        when(schedulerService.scheduleTask(any(Schedule.class))).thenReturn(true);

        mockMvc.perform(post("/api/schedules")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(scheduleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(schedule.getId())))
                .andExpect(jsonPath("$.workflowIdentifier", is(schedule.getWorkflowIdentifier())));

        verify(cronExpressionService, times(1)).isValidCronExpression(scheduleDTO.getCronExpression());
        verify(scheduleService, times(1)).createSchedule(any(ScheduleDTO.class));
        verify(schedulerService, times(1)).scheduleTask(any(Schedule.class));
    }

    @Test
    void createSchedule_WithoutCronExpression_ShouldGenerateAndCreateSchedule() throws Exception {
        scheduleDTO.setCronExpression(null);
        when(cronExpressionService.generateCronExpression(
                anyString(), any(), any(), any(), any(), any())).thenReturn("0 0 * * * ?");
        when(cronExpressionService.isValidCronExpression(anyString())).thenReturn(true);
        when(scheduleService.createSchedule(any(ScheduleDTO.class))).thenReturn(schedule);
        when(schedulerService.scheduleTask(any(Schedule.class))).thenReturn(true);

        mockMvc.perform(post("/api/schedules")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(scheduleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(schedule.getId())))
                .andExpect(jsonPath("$.workflowIdentifier", is(schedule.getWorkflowIdentifier())));

        verify(cronExpressionService, times(1)).generateCronExpression(
                scheduleDTO.getFrequency(),
                scheduleDTO.getMinuteOfHour(),
                scheduleDTO.getHourOfDay(),
                scheduleDTO.getDayOfMonth(),
                scheduleDTO.getMonthOfYear(),
                scheduleDTO.getDayOfWeek());
        verify(cronExpressionService, times(1)).isValidCronExpression(anyString());
        verify(scheduleService, times(1)).createSchedule(any(ScheduleDTO.class));
        verify(schedulerService, times(1)).scheduleTask(any(Schedule.class));
    }

    @Test
    void createSchedule_InvalidCronExpression_ShouldReturnBadRequest() throws Exception {
        when(cronExpressionService.isValidCronExpression(anyString())).thenReturn(false);

        mockMvc.perform(post("/api/schedules")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(scheduleDTO)))
                .andExpect(status().isBadRequest());

        verify(cronExpressionService, times(1)).isValidCronExpression(scheduleDTO.getCronExpression());
        verify(scheduleService, never()).createSchedule(any(ScheduleDTO.class));
        verify(schedulerService, never()).scheduleTask(any(Schedule.class));
    }

    @Test
    void updateSchedule_ExistingId_ShouldUpdateAndReturnSchedule() throws Exception {
        when(cronExpressionService.isValidCronExpression(anyString())).thenReturn(true);
        when(scheduleService.updateSchedule(eq("1"), any(ScheduleDTO.class))).thenReturn(Optional.of(schedule));
        when(schedulerService.scheduleTask(any(Schedule.class))).thenReturn(true);

        mockMvc.perform(put("/api/schedules/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(scheduleDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(schedule.getId())))
                .andExpect(jsonPath("$.workflowIdentifier", is(schedule.getWorkflowIdentifier())));

        verify(cronExpressionService, times(1)).isValidCronExpression(scheduleDTO.getCronExpression());
        verify(scheduleService, times(1)).updateSchedule(eq("1"), any(ScheduleDTO.class));
        verify(schedulerService, times(1)).scheduleTask(any(Schedule.class));
    }

    @Test
    void updateSchedule_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(cronExpressionService.isValidCronExpression(anyString())).thenReturn(true);
        when(scheduleService.updateSchedule(eq("999"), any(ScheduleDTO.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/schedules/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(scheduleDTO)))
                .andExpect(status().isNotFound());

        verify(cronExpressionService, times(1)).isValidCronExpression(scheduleDTO.getCronExpression());
        verify(scheduleService, times(1)).updateSchedule(eq("999"), any(ScheduleDTO.class));
        verify(schedulerService, never()).scheduleTask(any(Schedule.class));
    }

    @Test
    void deleteSchedule_ExistingId_ShouldReturnNoContent() throws Exception {
        when(scheduleService.deleteSchedule("1")).thenReturn(true);
        when(schedulerService.cancelTask("1")).thenReturn(true);

        mockMvc.perform(delete("/api/schedules/1"))
                .andExpect(status().isNoContent());

        verify(scheduleService, times(1)).deleteSchedule("1");
        verify(schedulerService, times(1)).cancelTask("1");
    }

    @Test
    void deleteSchedule_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(scheduleService.deleteSchedule("999")).thenReturn(false);

        mockMvc.perform(delete("/api/schedules/999"))
                .andExpect(status().isNotFound());

        verify(scheduleService, times(1)).deleteSchedule("999");
        verify(schedulerService, never()).cancelTask("999");
    }

    @Test
    void activateSchedule_ExistingId_ShouldActivateAndReturnSuccess() throws Exception {
        when(scheduleService.getScheduleById("1")).thenReturn(Optional.of(schedule));
        when(scheduleService.updateSchedule(eq("1"), any(Schedule.class))).thenReturn(Optional.of(schedule));
        when(schedulerService.scheduleTask(any(Schedule.class))).thenReturn(true);

        mockMvc.perform(post("/api/schedules/1/activate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activated", is(true)));

        verify(scheduleService, times(1)).getScheduleById("1");
        verify(scheduleService, times(1)).updateSchedule(eq("1"), any(Schedule.class));
        verify(schedulerService, times(1)).scheduleTask(any(Schedule.class));
    }

    @Test
    void activateSchedule_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(scheduleService.getScheduleById("999")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/schedules/999/activate"))
                .andExpect(status().isNotFound());

        verify(scheduleService, times(1)).getScheduleById("999");
        verify(scheduleService, never()).updateSchedule(anyString(), any(Schedule.class));
        verify(schedulerService, never()).scheduleTask(any(Schedule.class));
    }

    @Test
    void deactivateSchedule_ExistingId_ShouldDeactivateAndReturnSuccess() throws Exception {
        when(scheduleService.getScheduleById("1")).thenReturn(Optional.of(schedule));
        when(scheduleService.updateSchedule(eq("1"), any(Schedule.class))).thenReturn(Optional.of(schedule));
        when(schedulerService.cancelTask("1")).thenReturn(true);

        mockMvc.perform(post("/api/schedules/1/deactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deactivated", is(true)));

        verify(scheduleService, times(1)).getScheduleById("1");
        verify(scheduleService, times(1)).updateSchedule(eq("1"), any(Schedule.class));
        verify(schedulerService, times(1)).cancelTask("1");
    }

    @Test
    void deactivateSchedule_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(scheduleService.getScheduleById("999")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/schedules/999/deactivate"))
                .andExpect(status().isNotFound());

        verify(scheduleService, times(1)).getScheduleById("999");
        verify(scheduleService, never()).updateSchedule(anyString(), any(Schedule.class));
        verify(schedulerService, never()).cancelTask(anyString());
    }

    @Test
    void validateCronExpression_ValidExpression_ShouldReturnTrue() throws Exception {
        when(cronExpressionService.isValidCronExpression("0 0 * * * ?")).thenReturn(true);

        mockMvc.perform(post("/api/schedules/validate-cron")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"cronExpression\":\"0 0 * * * ?\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid", is(true)));

        verify(cronExpressionService, times(1)).isValidCronExpression("0 0 * * * ?");
    }

    @Test
    void validateCronExpression_InvalidExpression_ShouldReturnFalse() throws Exception {
        when(cronExpressionService.isValidCronExpression("invalid")).thenReturn(false);

        mockMvc.perform(post("/api/schedules/validate-cron")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"cronExpression\":\"invalid\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid", is(false)));

        verify(cronExpressionService, times(1)).isValidCronExpression("invalid");
    }
}
