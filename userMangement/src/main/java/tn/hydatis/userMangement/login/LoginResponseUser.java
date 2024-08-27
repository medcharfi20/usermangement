package tn.hydatis.userMangement.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.hydatis.userMangement.model.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseUser extends LoginResponsePrincipale {
    private User user;

    public LoginResponseUser(String message, boolean stayConnected, CookieDetails cookieDetails, User user) {
        super(message, stayConnected, cookieDetails); // Call to the superclass constructor
        this.user = user;
    }
}