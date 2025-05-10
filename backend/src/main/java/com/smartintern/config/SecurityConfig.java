package com.smartintern.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // CSRF kapalı
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS eklendi
            .headers(headers -> headers.frameOptions().disable()) // H2 Console için
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/register",
                    "/api/login",
                    "/api/users/**",
                    "/api/jobs/**",    // ✅ React frontend'in eriştiği endpointler
                    "/h2-console/**"
                ).permitAll()
                .anyRequest().permitAll()
            )
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // ✅ React development sunucusuna izin ver
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
