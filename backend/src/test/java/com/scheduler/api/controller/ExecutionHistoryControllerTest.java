package com.scheduler.api.controller;

import com.scheduler.api.model.ExecutionHistory;
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

@WebMvcTest(ExecutionHistoryController.class)
class ExecutionHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExecutionHistoryService executionHistoryService;

    @MockBean
    private ScheduleService scheduleService;

    private ExecutionHistory executionHistory;
    private Schedule schedule;

    @BeforeEach
    void setUp() {
        executionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId("schedule-1")
                .executionTime(LocalDateTime.now())
                .responseUrl("https://example.com/response/1")
                .status("SUCCESS")
                .retryCount(0)
                .errorMessage(null)
                .build();

        schedule = Schedule.builder()
                .id("schedule-1")
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
    void getAllExecutionHistories_ShouldReturnAllExecutionHistories() throws Exception {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryService.getAllExecutionHistories()).thenReturn(executionHistories);

        mockMvc.perform(get("/api/execution-history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(executionHistory.getId())))
                .andExpect(jsonPath("$[0].scheduleId", is(executionHistory.getScheduleId())));

        verify(executionHistoryService, times(1)).getAllExecutionHistories();
    }

    @Test
    void getExecutionHistoryById_ExistingId_ShouldReturnExecutionHistory() throws Exception {
        when(executionHistoryService.getExecutionHistoryById("1")).thenReturn(Optional.of(executionHistory));

        mockMvc.perform(get("/api/execution-history/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(executionHistory.getId())))
                .andExpect(jsonPath("$.scheduleId", is(executionHistory.getScheduleId())));

        verify(executionHistoryService, times(1)).getExecutionHistoryById("1");
    }

    @Test
    void getExecutionHistoryById_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(executionHistoryService.getExecutionHistoryById("999")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/execution-history/999"))
                .andExpect(status().isNotFound());

        verify(executionHistoryService, times(1)).getExecutionHistoryById("999");
    }

    @Test
    void getExecutionHistoriesByScheduleId_ShouldReturnMatchingExecutionHistories() throws Exception {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryService.getExecutionHistoriesByScheduleId("schedule-1")).thenReturn(executionHistories);

        mockMvc.perform(get("/api/execution-history/schedule/schedule-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(executionHistory.getId())))
                .andExpect(jsonPath("$[0].scheduleId", is(executionHistory.getScheduleId())));

        verify(executionHistoryService, times(1)).getExecutionHistoriesByScheduleId("schedule-1");
    }

    @Test
    void getSuccessRate_ShouldReturnSuccessRate() throws Exception {
        when(executionHistoryService.calculateSuccessRate("schedule-1")).thenReturn(85.0);

        mockMvc.perform(get("/api/execution-history/schedule/schedule-1/success-rate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successRate", is(85.0)));

        verify(executionHistoryService, times(1)).calculateSuccessRate("schedule-1");
    }

    @Test
    void getDetailedExecutionHistory_ExistingId_ShouldReturnDetailedHistory() throws Exception {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(scheduleService.getScheduleById("schedule-1")).thenReturn(Optional.of(schedule));
        when(executionHistoryService.getExecutionHistoriesByScheduleId("schedule-1")).thenReturn(executionHistories);
        when(executionHistoryService.calculateSuccessRate("schedule-1")).thenReturn(85.0);

        mockMvc.perform(get("/api/execution-history/schedule/schedule-1/detailed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.schedule.id", is(schedule.getId())))
                .andExpect(jsonPath("$.executions", hasSize(1)))
                .andExpect(jsonPath("$.executions[0].id", is(executionHistory.getId())))
                .andExpect(jsonPath("$.successRate", is(85.0)));

        verify(scheduleService, times(1)).getScheduleById("schedule-1");
        verify(executionHistoryService, times(1)).getExecutionHistoriesByScheduleId("schedule-1");
        verify(executionHistoryService, times(1)).calculateSuccessRate("schedule-1");
    }

    @Test
    void getDetailedExecutionHistory_NonExistingId_ShouldReturnNotFound() throws Exception {
        when(scheduleService.getScheduleById("non-existing")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/execution-history/schedule/non-existing/detailed"))
                .andExpect(status().isNotFound());

        verify(scheduleService, times(1)).getScheduleById("non-existing");
        verify(executionHistoryService, never()).getExecutionHistoriesByScheduleId(anyString());
        verify(executionHistoryService, never()).calculateSuccessRate(anyString());
    }

    @Test
    void getExecutionHistoriesByStatus_ShouldReturnMatchingExecutionHistories() throws Exception {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryService.getExecutionHistoriesByStatus("SUCCESS")).thenReturn(executionHistories);

        mockMvc.perform(get("/api/execution-history/status/SUCCESS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(executionHistory.getId())))
                .andExpect(jsonPath("$[0].status", is(executionHistory.getStatus())));

        verify(executionHistoryService, times(1)).getExecutionHistoriesByStatus("SUCCESS");
    }

    @Test
    void getExecutionHistoriesWithScheduleDetails_ShouldReturnHistoriesWithDetails() throws Exception {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryService.getAllExecutionHistories()).thenReturn(executionHistories);
        when(scheduleService.getScheduleById("schedule-1")).thenReturn(Optional.of(schedule));

        mockMvc.perform(get("/api/execution-history/with-schedule-details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].execution.id", is(executionHistory.getId())))
                .andExpect(jsonPath("$[0].schedule.id", is(schedule.getId())));

        verify(executionHistoryService, times(1)).getAllExecutionHistories();
        verify(scheduleService, times(1)).getScheduleById("schedule-1");
    }
}
