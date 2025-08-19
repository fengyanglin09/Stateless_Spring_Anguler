package diy.mqml.data.springdatacore.persistence.user.dto;



import diy.mqml.data.springdatacore.persistence.user.entity.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Getter
@Setter
public class UserRoleDto {

    private String name;
    private String title;
    private String description;

    public UserRoleDto() {
    }

    public UserRoleDto(UserRole role) {
        this.name = role.name();
        this.title = role.getFriendlyName();
        this.description = role.getDescription();
    }

    @Override
    public String toString() {
        return this.title;
    }
}
