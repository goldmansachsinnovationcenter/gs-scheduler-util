package com.scheduler.api.dto;

import com.scheduler.api.model.ContactPerson;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    @NotBlank(message = "Frequency is required")
    private String frequency; // "once" or "repetitive"
    
    private String cronExpression;
    private Integer dayOfWeek; // 1-7 (1 = Monday, 7 = Sunday)
    private Integer dayOfMonth; // 1-31
    private Integer weekOfMonth; // 1-5
    private Integer monthOfYear; // 1-12
    private Integer hourOfDay; // 0-23
    private Integer minuteOfHour; // 0-59
    
    @NotBlank(message = "HTTP method is required")
    private String httpMethod; // "GET" or "POST"
    
    private String payload; // JSON payload for POST calls
    
    @NotBlank(message = "Workflow identifier is required")
    private String workflowIdentifier;
    
    @NotNull(message = "Should retry flag is required")
    private Boolean shouldRetry;
    
    private Integer maxRetries;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String automationRequestId;
    
    @NotBlank(message = "Target application is required")
    private String targetApplication;
    
    @NotNull(message = "Contact persons are required")
    @Size(min = 2, message = "At least two contact persons are required")
    private List<ContactPerson> contactPersons;
    
    @NotBlank(message = "Communication DL is required")
    private String communicationDL;
}
