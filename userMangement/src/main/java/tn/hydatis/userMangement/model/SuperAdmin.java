package tn.hydatis.userMangement.model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_super_admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdmin extends StandardUser {

    @Column(name = "has_access")
    private boolean hasAccess;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        SuperAdmin that = (SuperAdmin) o;
        return hasAccess == that.hasAccess;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), hasAccess);
    }
}
