package tn.hydatis.userMangement.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.hydatis.userMangement.model.Admin;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseAdmin extends LoginResponsePrincipale {
    private Admin admin;

    // Constructor that sets both the superclass fields and the superAdmin field
    public LoginResponseAdmin(String message, boolean stayConnected, CookieDetails cookieDetails, Admin admin) {
        super(message, stayConnected, cookieDetails); // Call to the superclass constructor
        this.admin = admin;
    }
}