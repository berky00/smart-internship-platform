package com.smartintern.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartintern.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAll();
    
    // 🔹 Email’e göre kullanıcıyı bulmak için:
    Optional<User> findByEmail(String email);
}
