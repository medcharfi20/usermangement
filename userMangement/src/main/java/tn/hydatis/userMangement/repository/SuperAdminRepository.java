package tn.hydatis.userMangement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



import tn.hydatis.userMangement.model.SuperAdmin;

public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {
	  Optional<SuperAdmin> findByEmail(String email);

}
