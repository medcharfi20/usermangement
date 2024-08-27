package tn.hydatis.userMangement.init;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import tn.hydatis.userMangement.service.SuperAdminService;

@Component
public class DataInitializer {

    @Autowired
    private SuperAdminService superAdminService;

    @PostConstruct
    public void init() {
        try {
            if (superAdminService.getSuperAdminById(1L).isEmpty()) {
                superAdminService.saveSuperAdmin(
                    "Mohamed", 
                    "Charfi", 
                    "mohamedcharfi4070@gmail.com", 
                    "azerty", 
                    LocalDate.of(2001, 11, 28),
                    "27450039", 
                    true, 
                    null
                ); 
            }
        } catch (Exception e) {
            e.printStackTrace(); 
            throw new RuntimeException("Failed to initialize data", e);
        }
    }
}
