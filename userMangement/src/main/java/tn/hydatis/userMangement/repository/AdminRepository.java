package tn.hydatis.userMangement.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.hydatis.userMangement.model.Admin;
public interface AdminRepository extends JpaRepository<Admin, Long> {
    List<Admin> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
	  Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);


}
 
