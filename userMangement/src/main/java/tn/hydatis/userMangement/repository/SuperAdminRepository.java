package tn.hydatis.userMangement.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.hydatis.userMangement.model.SuperAdmin;

public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {
	  Optional<SuperAdmin> findByEmail(String email);
	  Optional<SuperAdmin> findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(
	            String nom, String prenom, String numeroTelephone, LocalDate dateDeNaissance);
	}


