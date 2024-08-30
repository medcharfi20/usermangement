package tn.hydatis.userMangement.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import tn.hydatis.userMangement.exception.EmailAlreadyExistsException;
import tn.hydatis.userMangement.exception.InvalidCredentialsException;
import tn.hydatis.userMangement.exception.UserBlockedException;
import tn.hydatis.userMangement.login.CookieDetails;
import tn.hydatis.userMangement.login.LoginRequest;
import tn.hydatis.userMangement.login.LoginResponseUser;
import tn.hydatis.userMangement.model.User;
import tn.hydatis.userMangement.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<String> createUser(
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("dateDeNaissance") LocalDate dateDeNaissance,
            @RequestParam("numeroTelephone") String numeroTelephone,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        try {
            User user = userService.saveUser(nom, prenom, email, password, dateDeNaissance, numeroTelephone, photo);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully with ID: " + user.getId());
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "prenom", required = false) String prenom,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "dateDeNaissance", required = false) LocalDate dateDeNaissance,
            @RequestParam(value = "numeroTelephone", required = false) String numeroTelephone,
            @RequestParam(value = "blocked", required = false) Boolean isBlocked,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        try {
            User updatedUser = userService.updateUser(id, nom, prenom, email, password, dateDeNaissance, numeroTelephone, isBlocked, photo);
            return ResponseEntity.ok("User updated successfully with ID: " + updatedUser.getId());
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(u -> ResponseEntity.ok(u))
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllUsers() {
        userService.deleteAllUsers();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsersByName(query);
        return ResponseEntity.ok(users);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseUser> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            CookieDetails cookieDetails = null;
            if (loginRequest.isStayConnected()) {
                Cookie cookie = new Cookie("USER_SESSION_COOKIE", "SESSION_VALUE");
                cookie.setMaxAge(604800); 
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setPath("/");
                response.addCookie(cookie);
                cookieDetails = new CookieDetails(cookie.getName(), cookie.getValue(), cookie.getMaxAge());
            }

            user.setPassword(null); 
            LoginResponseUser loginResponse = new LoginResponseUser(
                    "Login successful",
                    loginRequest.isStayConnected(),
                    cookieDetails,
                    user
            );
            return ResponseEntity.ok(loginResponse);

        } catch (UserBlockedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new LoginResponseUser(e.getMessage(), false, null, null));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseUser(e.getMessage(), false, null, null));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(new LoginResponseUser(e.getReason(), false, null, null));
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("USER_SESSION_COOKIE", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/retrieve-email")
    public ResponseEntity<String> retrieveEmail(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String numeroTelephone,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDeNaissance) {
        Optional<String> email = userService.getUserEmail(nom, prenom, numeroTelephone, dateDeNaissance);
        return email.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String numeroTelephone,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDeNaissance,
            @RequestParam String newPassword,
            @RequestParam String fullName) {
        boolean result = userService.changeUserPassword(nom, prenom, numeroTelephone, dateDeNaissance, newPassword, fullName);
        if (result) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or error occurred");
        }
    }
}
