package diy.mqml.data.springdatacore.persistence.user.dto;



import diy.mqml.data.springdatacore.persistence.user.entity.UserEntity;
import diy.mqml.data.springdatacore.persistence.user.entity.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

@Accessors(chain = true)
@Getter
@Setter
@ToString
public class UserDto {

    private Long id;
    private String lanId;
    private String lastname;
    private String firstname;
    private String emailAddress;
    private List<UserRoleDto> roles;
    private List<UserRoleDto> originalRoles;
    private LocalDateTime lastLoggedDate;

    public UserDto() {
        roles = new ArrayList<>();
    }

    public UserDto(UserEntity user) {
        this(user, user.getRoles());
    }

    public UserDto(UserEntity user, Collection<UserRole> roles) {
        this.id = user.getId();
        this.lanId = user.getLanId();
        this.lastname = user.getLastname();
        this.firstname = user.getFirstname();
        this.emailAddress = user.getEmailAddress();
        this.roles = roles
                .stream()
                .map(UserRoleDto::new)
                .sorted(Comparator.comparing(UserRoleDto::getName))
                .toList();
        this.originalRoles = user.getRoles()
                .stream()
                .map(UserRoleDto::new)
                .sorted(Comparator.comparing(UserRoleDto::getName))
                .toList();
        this.lastLoggedDate = user.getAccessDateTime();
    }


}
