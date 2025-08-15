package diy.mqml.data.backend.controller;

import diy.mqml.data.backend.config.security.customizedItems.components.AppSecurityUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint";
    }

    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint(@AuthenticationPrincipal AppSecurityUser user) {
        return ResponseEntity.ok("Hello, " + user.getFullName() + "! This is a protected endpoint.");
    }
}
