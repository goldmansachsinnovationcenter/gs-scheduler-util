package com.scheduler.api.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class CronExpressionServiceTest {

    private CronExpressionService cronExpressionService;

    @BeforeEach
    void setUp() {
        cronExpressionService = new CronExpressionService();
    }

    @Test
    void generateCronExpression_Once_WithAllParameters() {
        String cronExpression = cronExpressionService.generateCronExpression(
                "once", 30, 12, 15, 6, 3);
        
        assertEquals("30 12 15 6 * 3", cronExpression);
    }

    @Test
    void generateCronExpression_Once_WithNullParameters() {
        String cronExpression = cronExpressionService.generateCronExpression(
                "once", null, null, null, null, null);
        
        assertEquals("0 0 1 1 * 1", cronExpression);
    }

    @Test
    void generateCronExpression_Repetitive_WithAllParameters() {
        String cronExpression = cronExpressionService.generateCronExpression(
                "repetitive", 30, 12, 15, 6, 3);
        
        assertEquals("30 12 15 6 * 3", cronExpression);
    }

    @Test
    void generateCronExpression_Repetitive_WithNullParameters() {
        String cronExpression = cronExpressionService.generateCronExpression(
                "repetitive", null, null, null, null, null);
        
        assertEquals("* * * * * ?", cronExpression);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "0 0 * * * ?",
            "0 0 1 * * ?",
            "0 0 1 1 * ?",
            "0 0 1 1 * 1",
            "* * * * * ?"
    })
    void isValidCronExpression_ValidExpressions_ReturnsTrue(String cronExpression) {
        assertTrue(cronExpressionService.isValidCronExpression(cronExpression));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "",
            "invalid",
            "0 0",
            "0 0 0 0 0 0 0"
    })
    void isValidCronExpression_InvalidExpressions_ReturnsFalse(String cronExpression) {
        assertFalse(cronExpressionService.isValidCronExpression(cronExpression));
    }

    @Test
    void isValidCronExpression_NullExpression_ReturnsFalse() {
        assertFalse(cronExpressionService.isValidCronExpression(null));
    }
}
