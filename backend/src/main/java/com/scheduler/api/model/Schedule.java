package com.scheduler.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "schedules")
public class Schedule {
    @Id
    private String id;
    
    private String frequency; // "once" or "repetitive"
    private String cronExpression;
    private Integer dayOfWeek; // 1-7 (1 = Monday, 7 = Sunday)
    private Integer dayOfMonth; // 1-31
    private Integer weekOfMonth; // 1-5
    private Integer monthOfYear; // 1-12
    private Integer hourOfDay; // 0-23
    private Integer minuteOfHour; // 0-59
    
    private String httpMethod; // "GET" or "POST"
    private String payload; // JSON payload for POST calls
    private String workflowIdentifier;
    private Boolean shouldRetry;
    private Integer maxRetries;
    
    private String description;
    private String automationRequestId;
    private String targetApplication;
    private List<ContactPerson> contactPersons;
    private String communicationDL;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // "active", "inactive", "completed", etc.
}
