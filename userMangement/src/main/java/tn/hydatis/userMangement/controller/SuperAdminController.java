package tn.hydatis.userMangement.controller;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import tn.hydatis.userMangement.login.CookieDetails;
import tn.hydatis.userMangement.login.LoginRequest;
import tn.hydatis.userMangement.login.LoginResponse;
import tn.hydatis.userMangement.model.SuperAdmin;
import tn.hydatis.userMangement.service.SuperAdminService;
@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {
    @Autowired
    private SuperAdminService superAdminService;
    private static final Logger log = LoggerFactory.getLogger(SuperAdminController.class);
    @PostMapping
    public ResponseEntity<SuperAdmin> createSuperAdmin(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam LocalDate dateDeNaissance,
            @RequestParam String numeroTelephone,
            @RequestParam Boolean hasAccess,
            @RequestParam(required = false) MultipartFile file) throws IOException {
        SuperAdmin newSuperAdmin = superAdminService.saveSuperAdmin(nom, prenom, email, password, dateDeNaissance, numeroTelephone, hasAccess, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSuperAdmin);
    }
    @GetMapping("/{id}")
    public ResponseEntity<SuperAdmin> getSuperAdminById(@PathVariable Long id) {
        SuperAdmin superAdmin = superAdminService.getSuperAdminById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SuperAdmin not found"));
        return ResponseEntity.ok(superAdmin);
    }
    @PutMapping("/{id}")
    public ResponseEntity<SuperAdmin> updateSuperAdmin(
            @PathVariable Long id,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) LocalDate dateDeNaissance,
            @RequestParam(required = false) String numeroTelephone,
            @RequestParam(required = false) Boolean hasAccess,
            @RequestParam(required = false) MultipartFile file) throws IOException {
        SuperAdmin updatedSuperAdmin = superAdminService.updateSuperAdmin(id, nom, prenom, email, password, dateDeNaissance, numeroTelephone, hasAccess, file);
        return ResponseEntity.ok(updatedSuperAdmin);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        SuperAdmin superAdmin = superAdminService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        log.info("Attempting login for SuperAdmin: {}", loginRequest.getEmail());
        if (superAdmin != null) {
            CookieDetails cookieDetails = null;
            if (loginRequest.isStayConnected()) {
                Cookie cookie = new Cookie("SUPERADMIN_SESSION_COOKIE", "SESSION_VALUE");
                cookie.setMaxAge(604800); 
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/"); 
                response.addCookie(cookie);
                cookieDetails = new CookieDetails(cookie.getName(), cookie.getValue(), cookie.getMaxAge());
            } else {
                Cookie cookie = new Cookie("SUPERADMIN_SESSION_COOKIE", null);
                cookie.setMaxAge(0);
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/");
                response.addCookie(cookie);
            }
            superAdmin.setPassword(null);
            LoginResponse loginResponse = new LoginResponse(
                "Login successful",
                loginRequest.isStayConnected(),
                cookieDetails,
                superAdmin
            );
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(401).body(new LoginResponse("Invalid email or password", false, null, null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("SUPERADMIN_SESSION_COOKIE", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/retrieve-email")
    public ResponseEntity<String> getSuperAdminEmail(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String numeroTelephone,
            @RequestParam LocalDate dateDeNaissance) {
        Optional<String> email = superAdminService.getSuperAdminEmail(nom, prenom, numeroTelephone, dateDeNaissance);
        if (email.isPresent()) {
            return ResponseEntity.ok(email.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials. Unable to retrieve email.");
        }
    }
    @PostMapping("/change-password")
    public ResponseEntity<String> changeSuperAdminPassword(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String numeroTelephone,
            @RequestParam LocalDate dateDeNaissance,
            @RequestParam String newPassword) {
        
        boolean isPasswordChanged = superAdminService.changeSuperAdminPassword(nom, prenom, numeroTelephone, dateDeNaissance, newPassword);
        
        if (isPasswordChanged) {
            return ResponseEntity.ok("Password changed successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials. Unable to change password.");
        }
}
}