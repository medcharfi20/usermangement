package tn.hydatis.userMangement.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import tn.hydatis.userMangement.exception.EmailAlreadyExistsException;
import tn.hydatis.userMangement.exception.InvalidCredentialsException;
import tn.hydatis.userMangement.exception.UserBlockedException;
import tn.hydatis.userMangement.model.User;
import tn.hydatis.userMangement.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; 
    
    @Transactional
    public User saveUser(String nom, String prenom, String email, String password, LocalDate dateDeNaissance, String numeroTelephone, MultipartFile photo) throws IOException {
        validateUserFields(nom, prenom, email, password);

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email " + email + " already exists");
        }

        byte[] photoBytes = (photo != null && !photo.isEmpty()) ? photo.getBytes() : null;
        String encodedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setPhoto(photoBytes);
        user.setDateDeNaissance(dateDeNaissance);
        user.setNumeroTelephone(numeroTelephone);
        user.setBlocked(false);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, String nom, String prenom, String email, String password, LocalDate dateDeNaissance, String numeroTelephone, Boolean isBlocked, MultipartFile photo) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (userRepository.existsByEmail(email) && !email.equals(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email " + email + " already exists");
        }

        Optional.ofNullable(nom).ifPresent(user::setNom);
        Optional.ofNullable(prenom).ifPresent(user::setPrenom);
        Optional.ofNullable(email).ifPresent(user::setEmail);

        if (password != null && !password.isEmpty()) {
            String encodedPassword = passwordEncoder.encode(password);
            user.setPassword(encodedPassword);
        }

        Optional.ofNullable(dateDeNaissance).ifPresent(user::setDateDeNaissance);
        Optional.ofNullable(numeroTelephone).ifPresent(user::setNumeroTelephone);
        Optional.ofNullable(isBlocked).ifPresent(user::setBlocked);

        if (photo != null && !photo.isEmpty()) {
            user.setPhoto(photo.getBytes());
        }

        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllUsers() {
        userRepository.deleteAll();
    }

    public List<User> searchUsersByName(String searchTerm) {
        return userRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(searchTerm, searchTerm);
    }

    private void validateUserFields(String nom, String prenom, String email, String password) {
        if (nom == null || nom.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (prenom == null || prenom.trim().isEmpty()) {
            throw new IllegalArgumentException("Surname cannot be null or empty");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
    }
    public User authenticate(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Check if the user is blocked
            if (user.isBlocked()) {
                throw new UserBlockedException("Your account is blocked. Please contact support.");
            }

            // Validate the password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            } else {
                throw new InvalidCredentialsException("Invalid email or password");
            }
        } else {
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }
    @Transactional
    public Optional<String> getUserEmail(String nom, String prenom, String numeroTelephone, LocalDate dateDeNaissance) {
        return userRepository
                .findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(nom, prenom, numeroTelephone, dateDeNaissance)
                .map(User::getEmail);
    }

    @Transactional
    public boolean changeUserPassword(String nom, String prenom, String numeroTelephone, LocalDate dateDeNaissance, String newPassword, String fullName) {
        Optional<User> userOpt = userRepository.findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(nom, prenom, numeroTelephone, dateDeNaissance);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Send the new password before hashing, using the concatenated full name
            try {
                emailService.sendPasswordResetEmail(user.getEmail(), fullName, newPassword);
            } catch (MessagingException e) {
                // Handle the exception as needed
                return false;
            }

            // Hash the password and update the user record
            String hashedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(hashedPassword);
            userRepository.save(user);

            return true;
        } else {
            return false;
        }
    }


}
