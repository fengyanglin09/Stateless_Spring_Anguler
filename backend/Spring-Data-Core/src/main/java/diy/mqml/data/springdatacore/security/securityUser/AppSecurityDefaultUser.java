package diy.mqml.data.springdatacore.security.securityUser;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

@Getter
@Setter
@Builder
@Accessors(chain = true)
public class AppSecurityDefaultUser implements AppSecurityUser {
    private String id;
    private Object applicationId;
    private String lanId;
    private String personId;
    private String systemId;
    private String fullName;
    private String lastName;
    private String firstName;
    private String department;
    private String jobTitle;
    private String workSiteState;
    private String workSiteCity;
    private String mailLocation;
    private String emailAddress;
    private List<String> roles;
    private byte[] photo;

    AppSecurityDefaultUser(String id, Object applicationId, String lanId, String personId, String systemId,
                           String fullName, String lastName, String firstName, String department,
                           String jobTitle, String workSiteState, String workSiteCity, String mailLocation,
                           String emailAddress, List<String> roles, byte[] photo) {
        this.id = id;
        this.applicationId = applicationId;
        this.lanId = lanId;
        this.personId = personId;
        this.systemId = systemId;
        this.fullName = fullName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.department = department;
        this.jobTitle = jobTitle;
        this.workSiteState = workSiteState;
        this.workSiteCity = workSiteCity;
        this.mailLocation = mailLocation;
        this.emailAddress = emailAddress;
        this.roles = roles;
        this.photo = photo;
    }

    public AppSecurityDefaultUser(AppSecurityUser user) {
        this(
                user.getId(),
                user.getApplicationId(),
                user.getLanId(),
                user.getPersonId(),
                user.getSystemId(),
                user.getFullName(),
                user.getLastName(),
                user.getFirstName(),
                user.getDepartment(),
                user.getJobTitle(),
                user.getWorkSiteState(),
                user.getWorkSiteCity(),
                user.getMailLocation(),
                user.getEmailAddress(),
                user.getRoles(),
                user.getPhoto()
        );
    }

}
