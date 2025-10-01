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


    // Always use the full scope URI for Graph
    private static final String[] GRAPH_SCOPES = new String[] {
            "https://graph.microsoft.com/.default"
    };

    private final AzureSecurityPropertyClient azurePropertyService;



    public AzureGraphApiClient getGraphApiClient(Jwt jwt) {
        GraphServiceClient graphServiceClient = getGraphServiceClient(jwt);
        return AzureGraphApiClient.builder().graphServiceClient(graphServiceClient).build();
    }



    private GraphServiceClient getGraphServiceClient(Jwt jwt) {
        final String clientId = azurePropertyService.findClientId().orElseThrow();
        final String tenantId = azurePropertyService.findTenantId().orElseThrow();
        final String clientSecret = azurePropertyService.findClientSecret().orElseThrow();

        // This is the incoming user token your backend received
        final String oboToken = jwt.getTokenValue();

        final OnBehalfOfCredential credential = new OnBehalfOfCredentialBuilder()
                .clientId(clientId)
                .tenantId(tenantId)
                .clientSecret(clientSecret)
                .userAssertion(oboToken)
                .build();

        // Graph client uses the OBO credential with full Graph scopes
        return new GraphServiceClient(credential, GRAPH_SCOPES);
    }


}
