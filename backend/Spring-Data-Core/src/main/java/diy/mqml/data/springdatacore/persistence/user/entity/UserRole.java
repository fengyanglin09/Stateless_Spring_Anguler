package diy.mqml.data.springdatacore.persistence.user.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
public enum UserRole {
    IT_ADMIN(UserRole.ROLE_PREFIX + "IT_ADMIN", "IT_ADMIN" , "IT Administrator", "Manage application configuration"),
    NAMESPACE_ADMIN(UserRole.ROLE_PREFIX + "NAMESPACE_ADMIN", "NAMESPACE_ADMIN", "Namespace Administrator", "Manage metric and threshold configuration"),
    TECHNICIAN(UserRole.ROLE_PREFIX + "TECHNICIAN", "TECHNICIAN", "Technician", "Access metrics and quality information");

    public static final String ROLE_PREFIX = "ROLE_";
    public static final String AUTHORIZED_SECURITY_ROLE = ROLE_PREFIX + "AUTHORIZED";
    public static final String UNAUTHORIZED_SECURITY_ROLE = ROLE_PREFIX + "UNAUTHORIZED";

    private final String securityRole;
    private final String authority;
    private final String friendlyName;
    private final String description;

    public static UserRole getRole(String roleName) {
        if(roleName != null) {
            if(roleName.startsWith(ROLE_PREFIX)) {
                roleName = roleName.substring(ROLE_PREFIX.length());
            }
            return UserRole.valueOf(roleName);
        }
        return null;
    }

    UserRole(String securityRole, String authority, String friendlyName, String description) {
        this.securityRole = securityRole;
        this.authority = authority;
        this.friendlyName = friendlyName;
        this.description = description;
    }

    public String getName() {
        return name();
    }

    @Override
    public String toString() {
        return getFriendlyName();
    }
}
