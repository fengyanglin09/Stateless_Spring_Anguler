package diy.mqml.data.springdatacore.security.securityService;


import diy.mqml.data.springdatacore.security.AppSecurityUserDetails;
import diy.mqml.data.springdatacore.security.securityUser.AppSecurityDefaultUser;
import diy.mqml.data.springdatacore.security.securityUser.AppSecurityUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AppSecurityContextService {

    public Optional<AppSecurityUserDetails> findAuthentication() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                Object principal = authentication.getPrincipal();
                if (principal instanceof AppSecurityUserDetails securityAuthentication) {
                    return Optional.of(securityAuthentication);
                }
            }
        } catch (Exception e) {
            log.error("Error retrieving security context authentication", e);
        }

        return Optional.empty();
    }


    public List<? extends GrantedAuthority> findAuthorities() {
        return this.findAuthentication().map(AppSecurityUserDetails::getAuthorities).orElseGet(List::of);
    }

    public Optional<AppSecurityUser> findUser() {
        return this.findAuthentication().map(AppSecurityUserDetails::getDetails);
    }

    public Optional<Object> findUserApplicationId() {
        return this.findUser().map(AppSecurityUser::getApplicationId);
    }

    public <T> Optional<T> findUserApplicationId(Class<T> type) {
        return this.findUser().map((user) -> user.getApplicationId(type));
    }


    public void setAuthentication(AppSecurityUserDetails authentication) {
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.findAuthentication().ifPresent((authentication) -> authentication.setAuthorities(authorities));
    }

    public void setUser(AppSecurityUser user) {
        this.findAuthentication().ifPresent((authentication) -> authentication.setUser(user));
    }

    public void setUserApplicationId(Object applicationId) {
        this.findAuthentication().ifPresent((authentication) -> {

            AppSecurityDefaultUser appSecurityUser = new AppSecurityDefaultUser(authentication.getDetails());
            appSecurityUser.setApplicationId(applicationId);
            authentication.setUser(appSecurityUser);
        });
    }

}
