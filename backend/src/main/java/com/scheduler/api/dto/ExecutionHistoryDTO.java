package com.scheduler.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionHistoryDTO {
    private String id;
    private String scheduleId;
    private LocalDateTime executionTime;
    private String responseUrl;
    private String status;
    private Integer retryCount;
    private String errorMessage;
}
