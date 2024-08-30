package tn.hydatis.userMangement.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.hydatis.userMangement.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
	List<Admin> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
	Optional<Admin> findByEmail(String email);
	boolean existsByEmail(String email);
	Optional<Admin> findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(String nom, String prenom,
			String numeroTelephone, LocalDate dateDeNaissance);

}
