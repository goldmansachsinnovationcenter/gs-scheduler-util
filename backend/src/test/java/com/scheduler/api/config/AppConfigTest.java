package com.scheduler.api.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AppConfigTest {

    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private RestTemplate restTemplate;

    @Test
    void taskScheduler_ShouldBeConfiguredCorrectly() {
        assertNotNull(taskScheduler);
        assertTrue(taskScheduler instanceof ThreadPoolTaskScheduler);
        
        ThreadPoolTaskScheduler scheduler = (ThreadPoolTaskScheduler) taskScheduler;
        assertEquals("task-scheduler-", scheduler.getThreadNamePrefix());
    }

    @Test
    void restTemplate_ShouldBeCreated() {
        assertNotNull(restTemplate);
        assertTrue(restTemplate instanceof RestTemplate);
    }
}
