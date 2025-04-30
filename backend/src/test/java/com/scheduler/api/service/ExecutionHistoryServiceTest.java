package com.scheduler.api.service;

import com.scheduler.api.model.ExecutionHistory;
import com.scheduler.api.repository.ExecutionHistoryRepository;
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
class ExecutionHistoryServiceTest {

    @Mock
    private ExecutionHistoryRepository executionHistoryRepository;

    @InjectMocks
    private ExecutionHistoryService executionHistoryService;

    private ExecutionHistory executionHistory;

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
    }

    @Test
    void getAllExecutionHistories_ShouldReturnAllExecutionHistories() {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryRepository.findAll()).thenReturn(executionHistories);

        List<ExecutionHistory> result = executionHistoryService.getAllExecutionHistories();

        assertEquals(1, result.size());
        assertEquals(executionHistory.getId(), result.get(0).getId());
        verify(executionHistoryRepository, times(1)).findAll();
    }

    @Test
    void getExecutionHistoryById_ExistingId_ShouldReturnExecutionHistory() {
        when(executionHistoryRepository.findById("1")).thenReturn(Optional.of(executionHistory));

        Optional<ExecutionHistory> result = executionHistoryService.getExecutionHistoryById("1");

        assertTrue(result.isPresent());
        assertEquals(executionHistory.getId(), result.get().getId());
        verify(executionHistoryRepository, times(1)).findById("1");
    }

    @Test
    void getExecutionHistoryById_NonExistingId_ShouldReturnEmpty() {
        when(executionHistoryRepository.findById("999")).thenReturn(Optional.empty());

        Optional<ExecutionHistory> result = executionHistoryService.getExecutionHistoryById("999");

        assertFalse(result.isPresent());
        verify(executionHistoryRepository, times(1)).findById("999");
    }

    @Test
    void getExecutionHistoriesByScheduleId_ShouldReturnMatchingExecutionHistories() {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryRepository.findByScheduleId("schedule-1")).thenReturn(executionHistories);

        List<ExecutionHistory> result = executionHistoryService.getExecutionHistoriesByScheduleId("schedule-1");

        assertEquals(1, result.size());
        assertEquals(executionHistory.getId(), result.get(0).getId());
        verify(executionHistoryRepository, times(1)).findByScheduleId("schedule-1");
    }

    @Test
    void getExecutionHistoriesByStatus_ShouldReturnMatchingExecutionHistories() {
        List<ExecutionHistory> executionHistories = Arrays.asList(executionHistory);
        when(executionHistoryRepository.findByStatus("SUCCESS")).thenReturn(executionHistories);

        List<ExecutionHistory> result = executionHistoryService.getExecutionHistoriesByStatus("SUCCESS");

        assertEquals(1, result.size());
        assertEquals(executionHistory.getId(), result.get(0).getId());
        verify(executionHistoryRepository, times(1)).findByStatus("SUCCESS");
    }

    @Test
    void createExecutionHistory_ShouldCreateAndReturnExecutionHistory() {
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);

        ExecutionHistory result = executionHistoryService.createExecutionHistory(executionHistory);

        assertNotNull(result);
        assertEquals(executionHistory.getId(), result.getId());
        verify(executionHistoryRepository, times(1)).save(executionHistory);
    }

    @Test
    void updateExecutionHistory_ExistingId_ShouldUpdateAndReturnExecutionHistory() {
        when(executionHistoryRepository.findById("1")).thenReturn(Optional.of(executionHistory));
        when(executionHistoryRepository.save(any(ExecutionHistory.class))).thenReturn(executionHistory);

        ExecutionHistory updatedExecutionHistory = ExecutionHistory.builder()
                .id("1")
                .scheduleId("schedule-1")
                .executionTime(LocalDateTime.now())
                .responseUrl("https://example.com/response/updated")
                .status("FAILED")
                .retryCount(1)
                .errorMessage("Error message")
                .build();

        Optional<ExecutionHistory> result = executionHistoryService.updateExecutionHistory("1", updatedExecutionHistory);

        assertTrue(result.isPresent());
        assertEquals(executionHistory.getId(), result.get().getId());
        verify(executionHistoryRepository, times(1)).findById("1");
        verify(executionHistoryRepository, times(1)).save(any(ExecutionHistory.class));
    }

    @Test
    void updateExecutionHistory_NonExistingId_ShouldReturnEmpty() {
        when(executionHistoryRepository.findById("999")).thenReturn(Optional.empty());

        ExecutionHistory updatedExecutionHistory = ExecutionHistory.builder()
                .id("999")
                .scheduleId("schedule-1")
                .executionTime(LocalDateTime.now())
                .responseUrl("https://example.com/response/updated")
                .status("FAILED")
                .retryCount(1)
                .errorMessage("Error message")
                .build();

        Optional<ExecutionHistory> result = executionHistoryService.updateExecutionHistory("999", updatedExecutionHistory);

        assertFalse(result.isPresent());
        verify(executionHistoryRepository, times(1)).findById("999");
        verify(executionHistoryRepository, never()).save(any(ExecutionHistory.class));
    }

    @Test
    void deleteExecutionHistory_ExistingId_ShouldReturnTrue() {
        when(executionHistoryRepository.existsById("1")).thenReturn(true);
        doNothing().when(executionHistoryRepository).deleteById("1");

        boolean result = executionHistoryService.deleteExecutionHistory("1");

        assertTrue(result);
        verify(executionHistoryRepository, times(1)).existsById("1");
        verify(executionHistoryRepository, times(1)).deleteById("1");
    }

    @Test
    void deleteExecutionHistory_NonExistingId_ShouldReturnFalse() {
        when(executionHistoryRepository.existsById("999")).thenReturn(false);

        boolean result = executionHistoryService.deleteExecutionHistory("999");

        assertFalse(result);
        verify(executionHistoryRepository, times(1)).existsById("999");
        verify(executionHistoryRepository, never()).deleteById("999");
    }

    @Test
    void calculateSuccessRate_NoExecutions_ShouldReturnZero() {
        when(executionHistoryRepository.findByScheduleId("schedule-1")).thenReturn(List.of());

        double result = executionHistoryService.calculateSuccessRate("schedule-1");

        assertEquals(0.0, result);
        verify(executionHistoryRepository, times(1)).findByScheduleId("schedule-1");
    }

    @Test
    void calculateSuccessRate_AllSuccessful_ShouldReturn100Percent() {
        List<ExecutionHistory> executionHistories = Arrays.asList(
                ExecutionHistory.builder().status("SUCCESS").build(),
                ExecutionHistory.builder().status("SUCCESS").build()
        );
        when(executionHistoryRepository.findByScheduleId("schedule-1")).thenReturn(executionHistories);

        double result = executionHistoryService.calculateSuccessRate("schedule-1");

        assertEquals(100.0, result);
        verify(executionHistoryRepository, times(1)).findByScheduleId("schedule-1");
    }

    @Test
    void calculateSuccessRate_MixedResults_ShouldReturnCorrectPercentage() {
        List<ExecutionHistory> executionHistories = Arrays.asList(
                ExecutionHistory.builder().status("SUCCESS").build(),
                ExecutionHistory.builder().status("FAILED").build(),
                ExecutionHistory.builder().status("SUCCESS").build(),
                ExecutionHistory.builder().status("SUCCESS").build()
        );
        when(executionHistoryRepository.findByScheduleId("schedule-1")).thenReturn(executionHistories);

        double result = executionHistoryService.calculateSuccessRate("schedule-1");

        assertEquals(75.0, result);
        verify(executionHistoryRepository, times(1)).findByScheduleId("schedule-1");
    }
}
