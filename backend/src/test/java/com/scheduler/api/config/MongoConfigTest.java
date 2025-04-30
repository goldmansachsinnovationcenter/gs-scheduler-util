package com.scheduler.api.config;

import com.mongodb.client.MongoClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MongoConfigTest {

    @Autowired
    private MongoConfig mongoConfig;
    
    @Autowired
    private MongoClient mongoClient;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Value("${spring.data.mongodb.database}")
    private String expectedDatabaseName;

    @Test
    void getDatabaseName_ShouldReturnConfiguredDatabaseName() {
        assertEquals(expectedDatabaseName, mongoConfig.getDatabaseName());
    }

    @Test
    void mongoClient_ShouldBeCreated() {
        assertNotNull(mongoClient);
    }

    @Test
    void mongoTemplate_ShouldBeCreatedWithCorrectDatabase() {
        assertNotNull(mongoTemplate);
        assertEquals(expectedDatabaseName, mongoTemplate.getDb().getName());
    }
}
