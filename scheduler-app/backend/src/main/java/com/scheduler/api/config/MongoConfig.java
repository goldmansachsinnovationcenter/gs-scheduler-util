package com.scheduler.api.config;

import com.mongodb.client.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import java.io.File;

@Configuration
@EnableMongoRepositories(basePackages = "com.scheduler.api.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.database}")
    private String databaseName;
    
    @Value("${spring.mongodb.embedded.storage.database-dir:./data/mongodb}")
    private String databaseDir;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }
    
    @Bean
    public MongoTemplate mongoTemplate() {
        File dbDir = new File(databaseDir);
        if (!dbDir.exists()) {
            dbDir.mkdirs();
        }
        
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}
