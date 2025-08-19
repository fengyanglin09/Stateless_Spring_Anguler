package diy.mqml.data.springdatacore.security;


import java.util.Optional;

@FunctionalInterface
public interface AppSecurityUserRoleMapper {

    Optional<String> apply(String role);

}
