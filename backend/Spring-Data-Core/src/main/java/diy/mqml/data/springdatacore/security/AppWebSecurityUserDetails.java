package diy.mqml.data.springdatacore.security;

import diy.mqml.data.springdatacore.security.securityUser.AppSecurityUser;
import diy.mqml.data.springdatacore.security.securityUserSession.AppSecurityDefaultUserSession;
import diy.mqml.data.springdatacore.security.securityUserSession.AppSecurityUserSession;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Collection;

public class AppWebSecurityUserDetails extends AppSecurityUserDetails {


    public AppWebSecurityUserDetails(AppSecurityUser user, Collection<? extends GrantedAuthority> authorities) {
        super(user, authorities);
    }


    @Override
    public AppSecurityUserSession getUserSession() {
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        return AppSecurityDefaultUserSession.builder()
                .id(requestAttributes.getSessionId())
                .build();
    }

}
