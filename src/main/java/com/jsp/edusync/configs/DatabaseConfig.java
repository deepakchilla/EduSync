package com.jsp.edusync.configs;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.jsp.edusync.repositories")
@EntityScan(basePackages = "com.jsp.edusync.models")
@EnableTransactionManagement
public class DatabaseConfig {
    
    // JPA and database configuration is handled by Spring Boot auto-configuration
    // and the application.properties file
    
}
