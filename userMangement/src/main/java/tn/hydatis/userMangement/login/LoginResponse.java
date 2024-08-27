package tn.hydatis.userMangement.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.hydatis.userMangement.model.SuperAdmin;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse extends LoginResponsePrincipale {
    private SuperAdmin superAdmin;

    public LoginResponse(String message, boolean stayConnected, CookieDetails cookieDetails, SuperAdmin superAdmin) {
        super(message, stayConnected, cookieDetails); // Call to the superclass constructor
        this.superAdmin = superAdmin;
    }
}
