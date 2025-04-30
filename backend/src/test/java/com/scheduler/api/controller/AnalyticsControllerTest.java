package com.scheduler.api.controller;

import com.scheduler.api.model.Schedule;
import com.scheduler.api.service.ExecutionHistoryService;
import com.scheduler.api.service.ScheduleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScheduleService scheduleService;

    @MockBean
    private ExecutionHistoryService executionHistoryService;

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
                .description("Test Schedule")
                .targetApplication("TestApp")
                .communicationDL("test-dl@example.com")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .status("active")
                .build();
    }

    @Test
    void getAllSchedulesWithSuccessRates_ShouldReturnSchedulesWithRates() throws Exception {
        List<Schedule> schedules = Arrays.asList(schedule);
        when(scheduleService.getAllSchedules()).thenReturn(schedules);
        when(executionHistoryService.calculateSuccessRate("1")).thenReturn(85.0);

        mockMvc.perform(get("/api/analytics/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].schedule.id", is(schedule.getId())))
                .andExpect(jsonPath("$[0].successRate", is(85.0)));

        verify(scheduleService, times(1)).getAllSchedules();
        verify(executionHistoryService, times(1)).calculateSuccessRate("1");
    }

    @Test
    void searchSchedulesWithSuccessRates_ShouldReturnMatchingSchedulesWithRates() throws Exception {
        List<Schedule> schedules = Arrays.asList(schedule);
        when(scheduleService.searchSchedules("test")).thenReturn(schedules);
        when(executionHistoryService.calculateSuccessRate("1")).thenReturn(85.0);

        mockMvc.perform(get("/api/analytics/schedules/search").param("term", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].schedule.id", is(schedule.getId())))
                .andExpect(jsonPath("$[0].successRate", is(85.0)));

        verify(scheduleService, times(1)).searchSchedules("test");
        verify(executionHistoryService, times(1)).calculateSuccessRate("1");
    }

    @Test
    void getSuccessRateStatistics_ShouldReturnStatistics() throws Exception {
        List<Schedule> schedules = Arrays.asList(schedule);
        when(scheduleService.getAllSchedules()).thenReturn(schedules);
        when(executionHistoryService.calculateSuccessRate("1")).thenReturn(85.0);

        mockMvc.perform(get("/api/analytics/success-rates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overallSuccessRate", is(85.0)))
                .andExpect(jsonPath("$.totalSchedules", is(1)));

        verify(scheduleService, times(1)).getAllSchedules();
        verify(executionHistoryService, times(1)).calculateSuccessRate("1");
    }

    @Test
    void getScheduleSuccessRate_ExistingId_ShouldReturnSuccessRate() throws Exception {
        when(scheduleService.getScheduleById("1")).thenReturn(Optional.of(schedule));
        when(executionHistoryService.calculateSuccessRate("1")).thenReturn(85.0);

        mockMvc.perform(get("/api/analytics/schedules/1/success-rate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successRate", is(85.0)));

        verify(scheduleService, times(1)).getScheduleById("1");
        verify(executionHistoryService, times(1)).calculateSuccessRate("1");
    }

    @Test
    void getScheduleSuccessRate_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(scheduleService.getScheduleById("999")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/analytics/schedules/999/success-rate"))
                .andExpect(status().isNotFound());

        verify(scheduleService, times(1)).getScheduleById("999");
        verify(executionHistoryService, never()).calculateSuccessRate(anyString());
    }
}
