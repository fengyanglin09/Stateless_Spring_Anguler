package diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.service.component;


import com.azure.identity.OnBehalfOfCredential;
import com.azure.identity.OnBehalfOfCredentialBuilder;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.service.component.helper.AzureGraphApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AzureOBOGraphServiceClient {


    private static final String GRAPH_ME_ENDPOINT = "User.Read";

    private final AzureSecurityPropertyClient azurePropertyService;



    public AzureGraphApiClient getGraphApiClient(Jwt jwt) {
        GraphServiceClient graphServiceClient = getGraphServiceClient(jwt);
        return AzureGraphApiClient.builder().graphServiceClient(graphServiceClient).build();
    }



    private GraphServiceClient getGraphServiceClient(Jwt jwt) {
        final String clientId = this.azurePropertyService.findClientId().orElse(null);
        final String tenantId = this.azurePropertyService.findTenantId().orElse(null); // or "common" for multi-tenant apps
        final String clientSecret = this.azurePropertyService.findClientSecret().orElse(null);
        final String[] scopes = new String[] {GRAPH_ME_ENDPOINT};

        // This is the incoming token to exchange using on-behalf-of flow
        final String oboToken = jwt.getTokenValue();

        final OnBehalfOfCredential credential = new OnBehalfOfCredentialBuilder()
                .clientId(clientId).tenantId(tenantId).clientSecret(clientSecret)
                .userAssertion(oboToken).build();

        return new GraphServiceClient(credential, scopes);
    }


}
