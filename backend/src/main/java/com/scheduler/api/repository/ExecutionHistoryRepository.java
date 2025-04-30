package com.scheduler.api.repository;

import com.scheduler.api.model.ExecutionHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutionHistoryRepository extends MongoRepository<ExecutionHistory, String> {
    List<ExecutionHistory> findByScheduleId(String scheduleId);
    List<ExecutionHistory> findByStatus(String status);
    List<ExecutionHistory> findByScheduleIdAndStatus(String scheduleId, String status);
}
