package com.smartintern.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.smartintern.model.User;
import com.smartintern.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/users/register-with-cv")
    public User registerWithCv(@RequestParam("username") String username,
                            @RequestParam("email") String email,
                            @RequestParam("password") String password,
                            @RequestParam("role") String role,
                            @RequestParam("cvFile") MultipartFile cvFile) {
        try {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            user.setCvFile(cvFile.getBytes());

            // CV metni çıkarımı burada yapılıyor → saveUser() yeterli
            try (PDDocument document = PDDocument.load(cvFile.getInputStream())) {
                PDFTextStripper pdfStripper = new PDFTextStripper();
                String text = pdfStripper.getText(document);
                user.setCvText(text);
            }

            return userService.saveUser(user); // ← Değiştirildi
        } catch (IOException e) {
            throw new RuntimeException("Dosya işlenemedi: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginRequest) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        return userService.getUserByEmail(loginRequest.getEmail())
                .filter(user -> encoder.matches(loginRequest.getPassword(), user.getPassword()))
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Login başarılı!");
                    response.put("id", user.getId());
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("message", "Login başarısız! Email veya şifre yanlış.")));
    }


    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/users/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
