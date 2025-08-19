package diy.mqml.data.springdatacore.config.security;


import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.StrictHttpFirewall;


@Configuration
@EnableWebSecurity
@Slf4j
public class AppWebSecurityConfig {



    @Bean
    @Order(-1)
    public SecurityFilterChain fallbackFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/error") // catch-all for unexpected paths
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }


    /**
     * Customizes the HTTP firewall to allow URLs with encoded slashes (%2F) and double slashes (%2F%2F).
     * <p>
     * <b>Warning:</b> Enabling these options may introduce security risks. Use with caution.
     */

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return webSecurity -> {
            StrictHttpFirewall firewall = new StrictHttpFirewall();
            firewall.setAllowUrlEncodedDoubleSlash(true);
            firewall.setAllowUrlEncodedSlash(true);
            webSecurity.httpFirewall(firewall);
        };
    }

}
