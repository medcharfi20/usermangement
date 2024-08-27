package tn.hydatis.userMangement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                .requestMatchers("/api/superadmin/login").permitAll()
                .requestMatchers("/api/superadmin/**").permitAll() 
                .requestMatchers("/api/roles/**").permitAll()
                .requestMatchers("/api/users/login").permitAll()
                .requestMatchers("/api/users/**").permitAll() 
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/admins/login").permitAll()
                .requestMatchers("/api/admins/**").permitAll() 
                .anyRequest().authenticated() 
            )
            .formLogin().disable() 
            .logout().disable() 
            .sessionManagement() 
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
        return http.build();
    }
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("MY_SESSION_COOKIE"); 
        serializer.setCookiePath("/"); 
        serializer.setCookieMaxAge(604800); 
        return serializer;
    }
}
