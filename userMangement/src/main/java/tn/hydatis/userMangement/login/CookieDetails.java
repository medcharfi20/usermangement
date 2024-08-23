package tn.hydatis.userMangement.login;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CookieDetails {
    private String name;
    private String value;
    private int maxAge;
    }
