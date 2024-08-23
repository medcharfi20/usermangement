package tn.hydatis.userMangement.login;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.hydatis.userMangement.model.SuperAdmin;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String message;
    private SuperAdmin superAdmin;
    private boolean stayConnected;
    private CookieDetails cookieDetails; 
}