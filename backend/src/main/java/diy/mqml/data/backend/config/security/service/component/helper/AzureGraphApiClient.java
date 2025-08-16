package diy.mqml.data.backend.config.security.service.component.helper;

import com.microsoft.graph.models.User;
import com.microsoft.graph.models.UserCollectionResponse;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import com.microsoft.graph.users.UsersRequestBuilder;
import com.microsoft.graph.users.item.UserItemRequestBuilder;
import com.microsoft.graph.users.item.photo.PhotoRequestBuilder;
import com.microsoft.kiota.ApiException;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Slf4j
@Getter
@Builder
public class AzureGraphApiClient {

    private final static String[] USER_FIELDS = new String[]{
            "city", // String, matches work site city
            "department", // String
            "displayName", // String, matches fullName
            "employeeId", // String, matches personId
            "givenName", // String, matches lastName
            "id", // String
            "jobTitle", // String
            "mail", // String, matches emailAddress
            "mailNickname", // String, matches lanId
            "officeLocation", // String, matches mailLocation
            "onPremisesSecurityIdentifier", // String, matches systemId
            "state", // String, matches workSiteState
            "surname" // String, matches lastName
    };

    private final GraphServiceClient graphServiceClient;



    // Example filter: startswith(displayName, 'LastName')
    public List<AzureGraphApiUser> findUsers(String filter) {
        return findUsers(graphServiceClient.users(), filter);
    }

    public Optional<AzureGraphApiUser> findUser(String id) {
        return findUser(graphServiceClient.users().byUserId(id));
    }

    public Optional<AzureGraphApiUser> findCurrentUser() {
        return findUser(graphServiceClient.me());
    }

    private List<AzureGraphApiUser> findUsers(UsersRequestBuilder userRequestBuilder,
                                                         String filter) {
        try {
            UserCollectionResponse response = userRequestBuilder.get(requestConfiguration -> {
                if (requestConfiguration != null && requestConfiguration.queryParameters != null) {
                    requestConfiguration.queryParameters.select = USER_FIELDS;
                    requestConfiguration.queryParameters.filter = filter;
                }
            });
            if (response != null) {
                List<User> users = response.getValue();
                if (users != null && !users.isEmpty()) {
                    return users.stream()
                            .map(this::buildUser)
                            .toList();
                }
            }
        } catch (ApiException e) {
            if (e.getResponseStatusCode() == HttpStatus.NOT_FOUND.value()) {
                log.info("Users not found by the graph client");
            } else {
                throw new RuntimeException("Error retrieving users from graph client", e);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving users from graph client", e);
        }
        return List.of();
    }

    private Optional<AzureGraphApiUser> findUser(UserItemRequestBuilder userRequestBuilder) {
        try {
            User user = userRequestBuilder.get(requestConfiguration -> {
                if (requestConfiguration != null && requestConfiguration.queryParameters != null) {
                    requestConfiguration.queryParameters.select = USER_FIELDS;
                }
            });
            if (user != null) {
                return Optional.of(buildUser(user));
            }
        } catch (ApiException e) {
            if (e.getResponseStatusCode() == HttpStatus.NOT_FOUND.value()) {
                log.info("User not found by the graph client");
            } else {
                throw new RuntimeException("Error retrieving user from graph client", e);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving user from graph client", e);
        }
        return Optional.empty();
    }

    public Optional<byte[]> findUserPhoto() {
        return findUserPhoto(graphServiceClient.me().photo());
    }

    public Optional<byte[]> findUserPhoto(String id) {
        return findUserPhoto(graphServiceClient.users().byUserId(id).photo());
    }

    private Optional<byte[]> findUserPhoto(PhotoRequestBuilder photoRequestBuilder) {
        try {
            InputStream inputStream = photoRequestBuilder
                    .content()
                    .get();
            if (inputStream != null) {
                byte[] photo = IOUtils.toByteArray(inputStream);
                return Optional.of(photo);
            }
        } catch (ApiException e) {
            if (e.getResponseStatusCode() == HttpStatus.NOT_FOUND.value()) {
                log.info("User photo not found by the graph client");
            } else {
                throw new RuntimeException("Error retrieving user photo from graph client", e);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving user photo from graph client", e);
        }
        return Optional.empty();
    }

    private AzureGraphApiUser buildUser(User user) {
        return new AzureGraphApiUser(
                user.getId(),
                user.getMailNickname(),
                user.getEmployeeId(),
                user.getOnPremisesSecurityIdentifier(),
                user.getDisplayName(),
                user.getSurname(),
                user.getGivenName(),
                user.getDepartment(),
                user.getJobTitle(),
                user.getState(),
                user.getCity(),
                user.getOfficeLocation(),
                user.getMail()
        );
    }



}
