package diy.mqml.data.springdatacore.security;

import diy.mqml.data.springdatacore.security.securityUser.AppSecurityUser;
import diy.mqml.data.springdatacore.security.securityUserSession.AppSecurityUserSession;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
public class AppSecurityUserDetails implements UserDetails, Authentication, CredentialsContainer {

    protected AppSecurityUser user;
    protected List<? extends GrantedAuthority> authorities;
    protected boolean authenticated = false;
    private Jwt jwt;

    public AppSecurityUserDetails(AppSecurityUser user, Collection<? extends GrantedAuthority> authorities) {
        this.user = user;
        this.setAuthorities(authorities);
    }

    public AppSecurityUserSession getUserSession() {
        return null;
    }

    public void eraseCredentials() {
    }

    public String getCredentials() {
        return this.user.getLanId();
    }


    public AppSecurityUser getDetails() {
        return this.user;
    }

    public String getName() {
        return this.user.getLanId();
    }

    public String getPassword() {
        return null;
    }

    public String getPrincipal() {
        return this.user.getLanId();
    }

    public String getUsername() {
        return this.user.getLanId();
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }


    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        if (authorities != null && !authorities.isEmpty()) {
            this.authorities = List.copyOf(authorities);
        } else {
            this.authorities = List.of();
        }

    }

    @Override
    public String toString() {
        return "AppSecurityUserDetails{" +
                "user=" + user +
                ", authorities=" + authorities +
                ", authenticated=" + authenticated +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AppSecurityUserDetails that)) return false;
        return isAuthenticated() == that.isAuthenticated() && Objects.equals(getUser(), that.getUser()) && Objects.equals(getAuthorities(), that.getAuthorities());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUser(), getAuthorities(), isAuthenticated());
    }
}
