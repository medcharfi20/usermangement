package tn.hydatis.userMangement.model;

import java.util.Objects;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends StandardUser {

    @Column(name = "has_access")
    private boolean hasAccess = true;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)  // Role is required
    private Role role;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!super.equals(o)) return false;
        Admin admin = (Admin) o;
        return hasAccess == admin.hasAccess && Objects.equals(role, admin.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), hasAccess, role);
    }
}
