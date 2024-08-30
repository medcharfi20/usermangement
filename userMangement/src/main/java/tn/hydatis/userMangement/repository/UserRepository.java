package tn.hydatis.userMangement.repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import tn.hydatis.userMangement.model.User;  
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
    boolean existsByEmail(String email);
	Optional<User> findByEmail(String email);
	Optional<User> findByNomAndPrenomAndNumeroTelephoneAndDateDeNaissance(String nom, String prenom,
			String numeroTelephone, LocalDate dateDeNaissance);


}
