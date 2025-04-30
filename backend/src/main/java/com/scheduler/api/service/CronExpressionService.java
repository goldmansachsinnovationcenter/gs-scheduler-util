package com.scheduler.api.service;

import org.springframework.stereotype.Service;

@Service
public class CronExpressionService {

    /**
     * Generates a cron expression based on the provided parameters.
     * 
     * @param frequency "once" or "repetitive"
     * @param minuteOfHour 0-59
     * @param hourOfDay 0-23
     * @param dayOfMonth 1-31
     * @param monthOfYear 1-12
     * @param dayOfWeek 1-7 (1 = Monday, 7 = Sunday)
     * @return The generated cron expression
     */
    public String generateCronExpression(String frequency, Integer minuteOfHour, Integer hourOfDay, 
                                        Integer dayOfMonth, Integer monthOfYear, Integer dayOfWeek) {
        
        if ("once".equalsIgnoreCase(frequency)) {
            return String.format("%d %d %d %d * %d", 
                    minuteOfHour != null ? minuteOfHour : 0,
                    hourOfDay != null ? hourOfDay : 0,
                    dayOfMonth != null ? dayOfMonth : 1,
                    monthOfYear != null ? monthOfYear : 1,
                    dayOfWeek != null ? dayOfWeek : 1);
        } else {
            String minute = minuteOfHour != null ? String.valueOf(minuteOfHour) : "*";
            String hour = hourOfDay != null ? String.valueOf(hourOfDay) : "*";
            String day = dayOfMonth != null ? String.valueOf(dayOfMonth) : "*";
            String month = monthOfYear != null ? String.valueOf(monthOfYear) : "*";
            String weekday = dayOfWeek != null ? String.valueOf(dayOfWeek) : "?";
            
            return String.format("%s %s %s %s * %s", minute, hour, day, month, weekday);
        }
    }
    
    /**
     * Validates if the provided cron expression is valid.
     * 
     * @param cronExpression The cron expression to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidCronExpression(String cronExpression) {
        try {
            String[] parts = cronExpression.split("\\s+");
            return parts.length >= 5 && parts.length <= 6;
        } catch (Exception e) {
            return false;
        }
    }
}
