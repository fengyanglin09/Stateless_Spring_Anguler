package diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.service.component.helper;

public record AzureGraphApiUser(String id,
                                           String lanId,
                                           String personId,
                                           String systemId,
                                           String fullName,
                                           String lastName,
                                           String firstName,
                                           String department,
                                           String jobTitle,
                                           String workSiteState,
                                           String workSiteCity,
                                           String mailLocation,
                                           String emailAddress) {
}
