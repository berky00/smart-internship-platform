package com.smartintern.service;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.smartintern.model.User;
import com.smartintern.repository.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final WebClient webClient = WebClient.builder()
            .baseUrl("http://127.0.0.1:5000")
            .build();

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User saveUserWithCvText(User user) {
        if (user.getCvFile() == null) return saveUser(user);
        try {
            String base64File = Base64.getEncoder().encodeToString(user.getCvFile());
            String extractedText = webClient.post()
                    .uri("/extract")
                    .bodyValue(Map.of("file", base64File))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            user.setCvText(extractedText);
        } catch (Exception e) {
            System.err.println("CV metni çıkarılırken hata: " + e.getMessage());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
