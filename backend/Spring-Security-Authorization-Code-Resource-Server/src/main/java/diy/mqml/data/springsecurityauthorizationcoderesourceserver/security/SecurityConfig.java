package diy.mqml.data.springsecurityauthorizationcoderesourceserver.security;


import diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.customizedItems.CustomJwtAuthenticationConverter;
import diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.filter.AuthorizationLoggingFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthorizationLoggingFilter authorizationLoggingFilter) throws Exception {
        http.cors(Customizer.withDefaults())
                .authorizeHttpRequests(
                        authorize -> authorize
                        .requestMatchers("/api/public").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(authorizationLoggingFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(new CustomJwtAuthenticationConverter())));


        return http.build();
    }
}
