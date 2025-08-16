package diy.mqml.data.backend.controller;


import diy.mqml.data.backend.config.security.customizedItems.CustomJwtAuthenticationToken;
import diy.mqml.data.backend.config.security.customizedItems.CustomSecurityUserDetails;
import diy.mqml.data.backend.config.security.customizedItems.components.AppSecurityUser;
import diy.mqml.data.backend.config.security.customizedItems.components.DefaultAppSecurityUser;
import diy.mqml.data.backend.config.security.service.component.AzureOBOGraphServiceClient;
import diy.mqml.data.backend.config.security.service.component.helper.AzureGraphApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class ApiUserController {

    private final AzureOBOGraphServiceClient azureOBOGraphServiceClient;



    //todo - this needs to return the user info with the photo
    @GetMapping("/login")
    public ResponseEntity<String> login(@AuthenticationPrincipal Jwt jwt) {

        //load user info from graph api
        AzureGraphApiClient graphApiClient = this.azureOBOGraphServiceClient.getGraphApiClient(jwt);

        DefaultAppSecurityUser user = DefaultAppSecurityUser.builder().build();

        loadUserInfo(user, graphApiClient);

        loadUserPhoto(user, graphApiClient);

        //todo - save to the user database if needed

        //update the user details in the security context

        CustomJwtAuthenticationToken authentication = (CustomJwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        CustomSecurityUserDetails userDetails = authentication.getUser();

        userDetails.setUser(user);

        authentication.setUser(userDetails);

        SecurityContextHolder.getContext().setAuthentication(authentication);


        return ResponseEntity.ok("updated");
    }

    /**
     * Load photo from the graph client
     *
     * @param userBuilder User to build
     * @param graphClient Graph client for retrieving information
     */
    private void loadUserPhoto(DefaultAppSecurityUser userBuilder,
                               AzureGraphApiClient graphClient) {
        try {
            graphClient.findUserPhoto().ifPresent(userBuilder::setPhoto);
        } catch (Exception ex) {
            log.error("Error retrieving user photo from graph client", ex);
        }
    }
    /**
     * Load user info from graph client
     *
     * @param userBuilder User to build
     * @param graphClient Graph client for retrieving information
     */
    private void loadUserInfo(DefaultAppSecurityUser userBuilder,
                              AzureGraphApiClient graphClient) {
        try {
            graphClient.findCurrentUser()
                    .ifPresentOrElse(user -> {
                                userBuilder.setId(user.id());
                                userBuilder.setLanId(user.lanId());
                                userBuilder.setSystemId(user.systemId());
                                userBuilder.setPersonId(user.personId());
                                userBuilder.setFullName(user.fullName());
                                userBuilder.setLastName(user.lastName());
                                userBuilder.setFirstName(user.firstName());
                                userBuilder.setDepartment(user.department());
                                userBuilder.setJobTitle(user.jobTitle());
                                userBuilder.setWorkSiteState(user.workSiteState());
                                userBuilder.setWorkSiteCity(user.workSiteCity());
                                userBuilder.setMailLocation(user.mailLocation());
                                userBuilder.setEmailAddress(user.emailAddress());
                            },
                            () -> {
                                throw new InternalAuthenticationServiceException("Current user not found");
                            }
                    );
        } catch (Exception ex) {
            log.error("Error retrieving user info from graph client", ex);
            throw new InternalAuthenticationServiceException("Error retrieving user info");
        }
    }

}
