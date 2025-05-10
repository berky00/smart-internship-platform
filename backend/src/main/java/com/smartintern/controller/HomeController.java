package com.smartintern.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.smartintern.model.User;
import com.smartintern.repository.UserRepository;

@Controller
public class HomeController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public String index(Model model) {
        // Veritabanından kullanıcıları al
        Iterable<User> users = userRepository.findAll();

        // Kullanıcıları model'e ekle
        model.addAttribute("users", users);

        // index.html şablonunu döndür
        return "index";
    }
}
