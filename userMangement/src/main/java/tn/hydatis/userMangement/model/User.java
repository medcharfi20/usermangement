package tn.hydatis.userMangement.model;

import java.util.Objects;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User extends StandardUser {

    @Column(name = "is_blocked")
    private boolean isBlocked ;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!super.equals(o)) return false;
        User user = (User) o;
        return isBlocked == user.isBlocked;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), isBlocked);
    }
}
