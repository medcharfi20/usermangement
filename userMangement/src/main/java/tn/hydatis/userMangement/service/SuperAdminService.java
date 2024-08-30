package tn.hydatis.userMangement.service;

import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import tn.hydatis.userMangement.model.SuperAdmin;
import tn.hydatis.userMangement.repository.SuperAdminRepository;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    @Autowired
    private final SuperAdminRepository superAdminRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    private byte[] defaultPhoto;

    @PostConstruct
    private void init() throws IOException {
        defaultPhoto = getDefaultPhoto();
    }

    private byte[] getDefaultPhoto() throws IOException {
        ClassPathResource resource = new ClassPathResource("static/profile.jpg");
        return Files.readAllBytes(resource.getFile().toPath());
    }

    @Transactional
    public SuperAdmin saveSuperAdmin(String nom, String prenom, String email, String password, LocalDate dateDeNaissance, String numeroTelephone, boolean hasAccess, MultipartFile photo) throws IOException {
        byte[] photoBytes = (photo != null && !photo.isEmpty()) ? photo.getBytes() : defaultPhoto;
        String encodedPassword = passwordEncoder.encode(password);

        SuperAdmin superAdmin = new SuperAdmin();
        superAdmin.setNom(nom);
        superAdmin.setPrenom(prenom);
        superAdmin.setEmail(email);
        superAdmin.setPassword(encodedPassword);
        superAdmin.setPhoto(photoBytes);
        superAdmin.setDateDeNaissance(dateDeNaissance);
        superAdmin.setNumeroTelephone(numeroTelephone);
        superAdmin.setHasAccess(hasAccess);

        return superAdminRepository.save(superAdmin);
    }
    @Transactional
    public SuperAdmin updateSuperAdmin(Long id, String nom, String prenom, String email, String password, LocalDate dateDeNaissance, String numeroTelephone, Boolean hasAccess, MultipartFile photo) throws IOException {
        SuperAdmin superAdmin = superAdminRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SuperAdmin not found"));

        Optional.ofNullable(nom).ifPresent(superAdmin::setNom);
        Optional.ofNullable(prenom).ifPresent(superAdmin::setPrenom);
        Optional.ofNullable(email).ifPresent(superAdmin::setEmail);

        if (photo != null && !photo.isEmpty()) {
            byte[] photoBytes = photo.getBytes();
            superAdmin.setPhoto(photoBytes);
        } 
        if (password != null && !password.isEmpty()) {
            String encodedPassword = passwordEncoder.encode(password);
            superAdmin.setPassword(encodedPassword);
        }

        Optional.ofNullable(dateDeNaissance).ifPresent(superAdmin::setDateDeNaissance);
        Optional.ofNullable(numeroTelephone).ifPresent(superAdmin::setNumeroTelephone);

        
        return superAdminRepository.save(superAdmin);
    }


    public Optional<SuperAdmin> getSuperAdminById(Long id) {
        return superAdminRepository.findById(id);
    }

    public List<SuperAdmin> getAllSuperAdmins() {
        return superAdminRepository.findAll();
    }
    public SuperAdmin authenticate(String email, String password) {
        SuperAdmin superAdmin = superAdminRepository.findByEmail(email).orElse(null);
        if (superAdmin != null && passwordEncoder.matches(password, superAdmin.getPassword())) {
            return superAdmin;
        }
        return null;
    }
    public Optional<String> getSuperAdminEmail(String nom, String prenom, String numeroTelephone, LocalDate dateDeNaissance) {
        return superAdminRepository.findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(
                nom, prenom, numeroTelephone, dateDeNaissance)
                .map(SuperAdmin::getEmail);
    }
    public boolean changeSuperAdminPassword(String nom, String prenom, String numeroTelephone, LocalDate dateDeNaissance, String newPassword) {
        Optional<SuperAdmin> superAdminOpt = superAdminRepository.findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(nom, prenom, numeroTelephone, dateDeNaissance);
        
        if (superAdminOpt.isPresent()) {
            SuperAdmin superAdmin = superAdminOpt.get();

            // Encode the new password with BCrypt
            String encodedPassword = passwordEncoder.encode(newPassword);

            // Set the encoded password and save
            superAdmin.setPassword(encodedPassword);
            superAdminRepository.save(superAdmin);
            return true;
        }
        return false;
    }
    
}
