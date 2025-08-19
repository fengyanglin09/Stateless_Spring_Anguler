package diy.mqml.data.springdatacore.service.user;


import diy.mqml.data.springdatacore.persistence.user.dto.UserDto;
import diy.mqml.data.springdatacore.persistence.user.entity.*;
import diy.mqml.data.springdatacore.security.securityService.AppSecurityContextService;
import diy.mqml.data.springdatacore.security.securityUser.AppSecurityUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private static final Comparator<String> STRING_NULL_COMPARATOR = Comparator.nullsFirst(Comparator.naturalOrder());
    private static final Comparator<User> USER_COMPARATOR = Comparator.comparing(User::getLanId, STRING_NULL_COMPARATOR)
            .thenComparing(User::getFullname, STRING_NULL_COMPARATOR)
            .thenComparing(User::getEmailAddress, STRING_NULL_COMPARATOR)
            .thenComparing(User::getDepartment, STRING_NULL_COMPARATOR)
            .thenComparing(User::getJobTitle, STRING_NULL_COMPARATOR);

    private final UserRepository userRepository;
    private final UserAccessRepository userAccessRepository;
    private final AppSecurityContextService securityContextService;



    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Optional<UserEntity> findCurrentUser() {
        return securityContextService.findUserApplicationId(Long.class)
                .flatMap(this::findById);
    }

    public Optional<UserEntity> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<UserDto> findAll() {

        Sort orders = Sort.by(Sort.Order.asc("lastname"), Sort.Order.asc("firstname"));
        return this.userRepository.findAll(orders)
                .stream().map(UserDto::new).toList()
        ;
    }

    @Transactional
    public UserEntity save(UserEntity user) {
        return userRepository.save(user);
    }


    public Set<UserRole> getAllApplicableRoles(UserEntity user) {
        return findById(user.getId())
                .map(UserEntity::getRoles)
                .orElseGet(Set::of);
    }

    public boolean validateRoles(UserEntity user, Collection<UserRole> roles) {
        Set<String> roleNames = findById(user.getId())
                .map(u -> user.getRoles().stream()
                        .map(UserRole::getName)
                        .collect(Collectors.toSet()))
                .orElseGet(Set::of);
        return roles.stream().allMatch(r -> roleNames.contains(r.getName()));
    }

    public List<UserRole> mapAuthoritiesToRoles(Collection<? extends GrantedAuthority> authorities) {
        if (authorities != null && !authorities.isEmpty()) {
            return authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(authority -> !authority.equals(UserRole.AUTHORIZED_SECURITY_ROLE) &&
                            !authority.equals(UserRole.UNAUTHORIZED_SECURITY_ROLE))
                    .map(authority -> {
                        try {
                            return Optional.of(UserRole.getRole(authority));
                        } catch (Exception ex) {
                            log.warn("Unknown authority {}", authority);
                            return Optional.<UserRole>empty();
                        }
                    })
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .toList();
        }
        return List.of();
    }

    public List<? extends GrantedAuthority> mapRolesToAuthorities(List<UserRole> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (roles != null) {
            roles.forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getSecurityRole())));
        }
        if (!authorities.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority(UserRole.AUTHORIZED_SECURITY_ROLE));
        } else {
            authorities.add(new SimpleGrantedAuthority(UserRole.UNAUTHORIZED_SECURITY_ROLE));
        }
        return authorities;
    }

    public List<UserRole> mapRoleNamesToRoles(Collection<String> roleNames) {
        if (roleNames != null) {
            return roleNames.stream()
                    .map(role -> {
                        try {
                            return Optional.of(UserRole.valueOf(role));
                        } catch (Exception ex) {
                            log.warn("Unknown role {}", role);
                            return Optional.<UserRole>empty();
                        }
                    })
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .distinct()
                    .toList();
        }
        return List.of();
    }

    public boolean hasAnyRoles(UserRole... roles) {
        List<? extends GrantedAuthority> authorities = securityContextService.findAuthorities();
        if (!authorities.isEmpty()) {
            for (UserRole role : roles) {
                if (authorities.stream().anyMatch(authority -> authority.getAuthority().equals(role.getAuthority()) || authority.getAuthority().equals(role.getSecurityRole()))) {

                    return true;
                }
            }
        }
        return false;
    }

    @Transactional
    public void registerUser(AppSecurityUser authenticatedUser) {
        UserEntity authUser = new UserEntity(authenticatedUser.getLanId(), authenticatedUser.getLastName(), authenticatedUser.getFirstName())
                .setFullname(authenticatedUser.getFullName())
                .setEmailAddress(authenticatedUser.getEmailAddress())
                .setDepartment(authenticatedUser.getDepartment())
                .setJobTitle(authenticatedUser.getJobTitle())
                .setPhoto(authenticatedUser.getPhoto())
                .setRoles(new HashSet<>(mapRoleNamesToRoles(authenticatedUser.getRoles())));



        UserEntity user = userRepository.findByLanId(authUser.getLanId()).orElse(null);
        if (user == null) {
            log.info("Creating user with lanid {} ({})",
                    authUser.getLanId(),
                    authUser.getFullname()
            );
            user = save(authUser);
        } else if (!matches(authUser, user) || !Arrays.equals(user.getPhoto(), authUser.getPhoto())) {
            log.info("Updating user roles with lanid {} ({})",
                    authUser.getLanId(),
                    authUser.getFullname()
            );
            user.setLastname(authUser.getLastname())
                    .setFirstname(authUser.getFirstname())
                    .setFullname(authUser.getFullname())
                    .setEmailAddress(authUser.getEmailAddress())
                    .setDepartment(authUser.getDepartment())
                    .setJobTitle(authUser.getJobTitle())
                    .setPhoto(authUser.getPhoto())
                    .setRoles(authUser.getRoles());
            user = save(user);
        }
        noteUserLogin(user);
        securityContextService.setUserApplicationId(user.getId());
        log.debug("Updating user {} ({}, {}) last login",
                user.getLanId(),
                user.getLastname(),
                user.getFirstname()
        );
    }

    private void noteUserLogin(UserEntity user) {
        UserAccess userAccess = new UserAccess().appUserId(user.getId()).accessDateTime(LocalDateTime.now());
        this.userAccessRepository.save(userAccess);
    }

    private boolean matches(User user1, User user2) {
        return USER_COMPARATOR.compare(user1, user2) == 0 &&
                user1.getRoles().size() == user2.getRoles().size() &&
                user1.getRoles().containsAll(user2.getRoles());
    }
}
