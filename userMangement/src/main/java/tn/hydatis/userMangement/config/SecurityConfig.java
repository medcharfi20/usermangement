package tn.hydatis.userMangement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable() 
            .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                .requestMatchers("/api/roles/**").permitAll() 
                .requestMatchers("/api/superadmin/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/uploads/**").permitAll() 
                .requestMatchers("/api/admins/**").permitAll() 
                .anyRequest().authenticated()
            )
            .httpBasic();
        return http.build();
    }
}
