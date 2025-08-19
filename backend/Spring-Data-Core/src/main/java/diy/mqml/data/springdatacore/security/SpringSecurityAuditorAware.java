package diy.mqml.data.springdatacore.security;



import diy.mqml.data.springdatacore.persistence.user.entity.UserEntity;
import diy.mqml.data.springdatacore.service.user.UserService;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SpringSecurityAuditorAware implements AuditorAware<UserEntity> {
    private final UserService userService;

    public SpringSecurityAuditorAware(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Optional<UserEntity> getCurrentAuditor() {
        return userService.findCurrentUser();
    }
}
