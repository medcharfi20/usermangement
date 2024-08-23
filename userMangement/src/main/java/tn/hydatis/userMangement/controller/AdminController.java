package tn.hydatis.userMangement.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import tn.hydatis.userMangement.exception.EmailAlreadyExistsException;
import tn.hydatis.userMangement.model.Admin;
import tn.hydatis.userMangement.service.AdminService;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @PostMapping
    public ResponseEntity<String> createAdmin(
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("dateDeNaissance") LocalDate dateDeNaissance,
            @RequestParam("numeroTelephone") String numeroTelephone,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam("roleId") Long roleId) {
        try {
            Admin admin = adminService.saveAdmin(nom, prenom, email, password, dateDeNaissance, numeroTelephone, photo, roleId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Admin created successfully");
        } catch (EmailAlreadyExistsException e) {
            logger.error("Email already exists: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists: " + e.getMessage());
        } catch (IOException e) {
            logger.error("Error processing file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAdmin(
            @PathVariable Long id,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "prenom", required = false) String prenom,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "dateDeNaissance", required = false) LocalDate dateDeNaissance,
            @RequestParam(value = "numeroTelephone", required = false) String numeroTelephone,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "roleId", required = false) Long roleId) {
        try {
            Admin updatedAdmin = adminService.updateAdmin(id, nom, prenom, email, password, dateDeNaissance, numeroTelephone, photo, roleId);
            return ResponseEntity.ok("Admin updated successfully");
        } catch (EmailAlreadyExistsException e) {
            logger.error("Email already exists: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists: " + e.getMessage());
        } catch (IOException e) {
            logger.error("Error processing file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating admin: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found or error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        Optional<Admin> admin = adminService.getAdminById(id);
        if (admin.isPresent()) {
            return ResponseEntity.ok(admin.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
        }
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        try {
            adminService.deleteAdminById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting admin: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllAdmins() {
        adminService.deleteAllAdmins();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Admin>> searchAdmins(@RequestParam String query) {
        List<Admin> admins = adminService.searchAdminsByName(query);
        return ResponseEntity.ok(admins);
    }
}
