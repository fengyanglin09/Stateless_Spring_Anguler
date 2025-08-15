package diy.mqml.data.backend.config.security.customizedItems;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;

/**
 * note that the super class JwtAuthenticationToken will set the authenticated to true if the authorities is not empty.
 * */
@Getter
@Setter
@Accessors(chain = true)
public class CustomJwtAuthenticationToken extends JwtAuthenticationToken {

    private CustomSecurityUserDetails user;

    public CustomJwtAuthenticationToken(Jwt jwt) {
        super(jwt);
    }

    public CustomJwtAuthenticationToken(Jwt jwt, Collection<? extends GrantedAuthority> authorities) {
        super(jwt, authorities);
    }

    public CustomJwtAuthenticationToken(Jwt jwt, Collection<? extends GrantedAuthority> authorities, String name) {
        super(jwt, authorities, name);
    }

    public CustomJwtAuthenticationToken(Jwt jwt, Collection<? extends GrantedAuthority> authorities, String name, CustomSecurityUserDetails user) {
        super(jwt, authorities, name);

        this.user = user;

    }

    @Override
    public Object getPrincipal() {
        return user.getUser();
    }
}
