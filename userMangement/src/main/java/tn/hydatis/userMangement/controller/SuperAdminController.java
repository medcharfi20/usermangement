package tn.hydatis.userMangement.controller;
import java.io.IOException;
import java.time.LocalDate;
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
        if (superAdmin != null) {
            CookieDetails cookieDetails = null;
            if (loginRequest.isStayConnected()) {
                Cookie cookie = new Cookie("SESSION_COOKIE", "SESSION_VALUE");
                cookie.setMaxAge(604800); // Set max age to 1 week
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/"); // Ensure the cookie is available to the entire app
                response.addCookie(cookie);
                cookieDetails = new CookieDetails(cookie.getName(), cookie.getValue(), cookie.getMaxAge());
            } else {
                // Clear any existing session cookie
                Cookie cookie = new Cookie("SESSION_COOKIE", null);
                cookie.setMaxAge(0);
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/");
                response.addCookie(cookie);
            }
            superAdmin.setPassword(null);
            LoginResponse loginResponse = new LoginResponse(
                "Login successful",
                superAdmin,
                loginRequest.isStayConnected(),
                cookieDetails
            );
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(401).body(new LoginResponse("Invalid email or password", null, false, null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("SESSION_COOKIE", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.noContent().build();
    }
}
