package tn.hydatis.userMangement.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import tn.hydatis.userMangement.exception.EmailAlreadyExistsException;
import tn.hydatis.userMangement.model.Admin;
import tn.hydatis.userMangement.model.Role;
import tn.hydatis.userMangement.repository.AdminRepository;
import tn.hydatis.userMangement.repository.RoleRepository;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    public AdminService(AdminRepository adminRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Admin saveAdmin(String nom, String prenom, String email, String password, LocalDate dateDeNaissance, String numeroTelephone, MultipartFile photo, Long roleId) throws IOException {
        if (adminRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email " + email + " already exists");
        }

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role with ID " + roleId + " not found"));

        byte[] photoBytes = (photo != null && !photo.isEmpty()) ? photo.getBytes() : null;
        String encodedPassword = passwordEncoder.encode(password);

        Admin admin = new Admin();
        admin.setNom(nom);
        admin.setPrenom(prenom);
        admin.setEmail(email);
        admin.setPassword(encodedPassword);
        admin.setPhoto(photoBytes);
        admin.setDateDeNaissance(dateDeNaissance);
        admin.setNumeroTelephone(numeroTelephone);
        admin.setRole(role);

        return adminRepository.save(admin);
    }

    @Transactional
    public Admin updateAdmin(Long id, String nom, String prenom, String email, String password, 
                             LocalDate dateDeNaissance, String numeroTelephone, MultipartFile photo, 
                             Long roleId) throws IOException {
        
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                                                              "Admin with ID " + id + " not found"));

        if (email != null && adminRepository.existsByEmail(email) && !email.equals(admin.getEmail())) {
            throw new EmailAlreadyExistsException("Email " + email + " already exists");
        }

        if (roleId != null) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                                                                  "Role with ID " + roleId + " not found"));
            admin.setRole(role);
        }

        logger.debug("Updating Admin with ID: {}", id);
        
        Optional.ofNullable(nom).ifPresent(admin::setNom);
        Optional.ofNullable(prenom).ifPresent(admin::setPrenom);
        Optional.ofNullable(email).ifPresent(admin::setEmail);
        
        if (password != null && !password.isEmpty()) {
            String encodedPassword = passwordEncoder.encode(password);
            admin.setPassword(encodedPassword);
        }

        Optional.ofNullable(dateDeNaissance).ifPresent(admin::setDateDeNaissance);
        Optional.ofNullable(numeroTelephone).ifPresent(admin::setNumeroTelephone);

        if (photo != null && !photo.isEmpty()) {
            admin.setPhoto(photo.getBytes());
        }

        logger.debug("Final Admin State: {}", admin);

        return adminRepository.save(admin);
    }

    @Transactional(readOnly = true)
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Admin> searchAdminsByName(String searchTerm) {
        return adminRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(searchTerm, searchTerm);
    }

    @Transactional
    public void deleteAdminById(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin with ID " + id + " not found");
        }
        adminRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllAdmins() {
        adminRepository.deleteAll();
    }
    public Admin authenticate(String email, String password) {
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            return admin;
        }
        return null;
    }

}
