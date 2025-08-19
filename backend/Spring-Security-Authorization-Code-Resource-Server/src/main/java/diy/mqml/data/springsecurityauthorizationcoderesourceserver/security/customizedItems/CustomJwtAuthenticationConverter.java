package diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.customizedItems;


import diy.mqml.data.springdatacore.security.AppSecurityUserDetails;
import diy.mqml.data.springdatacore.security.securityUser.AppSecurityDefaultUser;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.stream.Collectors;

public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // Extract claims
        String userId = jwt.getClaimAsString("sub"); // or "oid"
        String name = jwt.getClaimAsString("name");
        String email = jwt.getClaimAsString("email");
        List<String> roles = jwt.getClaimAsStringList("roles") != null
                ? jwt.getClaimAsStringList("roles")
                : List.of();

        // Create UserPrincipal
        AppSecurityDefaultUser user = AppSecurityDefaultUser.builder().id(userId)
                .fullName(name)
                .emailAddress(email)
                .roles(roles)
                .build();

        AppSecurityUserDetails principal = new AppSecurityUserDetails(user,
                roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .toList());

        // Create authorities
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());

        // Return authentication token
        return new CustomJwtAuthenticationToken(jwt, authorities, user.getId(), principal);
    }

}
