package tn.hydatis.userMangement.repository; 
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tn.hydatis.userMangement.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
	 @Query("SELECT r FROM Role r ORDER BY r.id ASC")
	List<Role> findAllRolesSortedByName();
	List<Role> findByNameIgnoreCase(String name);
	Optional<Role> findByName(String name);

}
