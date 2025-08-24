package com.jsp.edusync.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve React build files
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "file:./build/")
                .setCachePeriod(0);
        
        // Serve uploaded files
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Serve React app for all non-API routes
        registry.addViewController("/")
                .setViewName("forward:/index.html");
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}
