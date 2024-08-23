package tn.hydatis.userMangement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import tn.hydatis.userMangement.model.Role;
import tn.hydatis.userMangement.repository.RoleRepository;
import tn.hydatis.userMangement.exception.RoleAlreadyExistsException;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Transactional
    public Role createRole(Role role) {
        // Check if a role with the same name already exists
        Optional<Role> existingRole = roleRepository.findByName(role.getName());
        if (existingRole.isPresent()) {
            // Use the custom exception to handle the conflict
            throw new RoleAlreadyExistsException("Role with the name '" + role.getName() + "' already exists");
        }

        // Save and return the new role
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll(); 
    }

    public Role getRoleByName(String name) {
        return roleRepository.findByNameIgnoreCase(name)
                             .stream()
                             .findFirst()
                             .orElse(null);
    }

    public Role getRoleById(long id) {
        return roleRepository.findById(id)
                             .orElse(null);
    }

    @Transactional
    public Role updateRole(Long id, Role updatedRole) {
        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            Role role = optionalRole.get();
            if (updatedRole.getName() != null) {
                // Check for duplicate names before updating
                Optional<Role> duplicateRole = roleRepository.findByName(updatedRole.getName());
                if (duplicateRole.isPresent() && !duplicateRole.get().getId().equals(id)) {
                    throw new RoleAlreadyExistsException("Role with the name '" + updatedRole.getName() + "' already exists");
                }
                role.setName(updatedRole.getName());
            }
            if (updatedRole.getDescription() != null) {
                role.setDescription(updatedRole.getDescription());
            }
            return roleRepository.save(role);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found");
    }

    @Transactional
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found");
        }

        roleRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllRoles() {
        roleRepository.deleteAll();
    }
}
