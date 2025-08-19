package diy.mqml.data.springdatacore.persistence.user.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.LazyGroup;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A user of the application.  Define what their roles are and who they are.
 */
@Entity
@Table( name = "AppUser",
        uniqueConstraints = @UniqueConstraint(name = "unique_user_lanid", columnNames = "lanId")
)
@Accessors(chain = true)
@Getter
@Setter
public class UserEntity implements User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int version = 0;

    @NotNull
    private String lanId;

    private String lastname;
    private String firstname;
    private String fullname;
    @Email
    private String emailAddress;
    private String department;
    private String jobTitle;
    @Lob
    @LazyGroup("lobs")
    @Basic(fetch = FetchType.LAZY)
    private byte[] photo;

    @ElementCollection(targetClass = UserRole.class, fetch = FetchType.LAZY)
    @CollectionTable(
            schema = "dbo",
            name = "AppUserRole",
            joinColumns = @JoinColumn(name = "AppUser_id"),
            uniqueConstraints = {@UniqueConstraint(name = "unique_userrole", columnNames = {"AppUser_id", "role"})})
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Set<UserRole> roles = new HashSet<>();

    private LocalDateTime accessDateTime = LocalDateTime.now();

    public UserEntity() {
    }

    public UserEntity(String lanId, String lastname, String firstname) {
        Objects.requireNonNull(lanId);
        Objects.requireNonNull(lastname);
        Objects.requireNonNull(firstname);

        this.lanId = lanId;
        this.lastname = lastname;
        this.firstname = firstname;
        this.fullname = lastname + ", " + firstname;
    }

    /**
     *
     * should not be used for configuring the changed roles, this will still have the original roles
     * */
    public boolean hasAnyRole(UserRole... roles) {

        for (UserRole role : roles) {
            if(this.roles.contains(role)){
                return true;
            }
        }
        return false;
    }

    @Override
    public String getDisplayname() {
        if (lanId == null) {
            return getFullname();
        } else {
            return String.format("%s (%s)", getFullname(), lanId);
        }
    }

    @Override
    public String toString() {
        return "UserEntity{id=" + id +
                ", lanId=" + lanId +
                ", lastname=" + lastname +
                ", firstname=" + firstname +
                ", fullname=" + fullname +
                ", emailAddress=" + emailAddress +
                ", department=" + department +
                ", jobTitle=" + jobTitle +
                '}';
    }
}
