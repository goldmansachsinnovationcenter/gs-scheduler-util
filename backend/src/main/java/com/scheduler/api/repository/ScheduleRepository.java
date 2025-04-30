package com.scheduler.api.repository;

import com.scheduler.api.model.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    List<Schedule> findByWorkflowIdentifierContaining(String workflowIdentifier);
    List<Schedule> findByDescriptionContaining(String description);
    List<Schedule> findByTargetApplication(String targetApplication);
    List<Schedule> findByStatus(String status);
}
