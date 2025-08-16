package diy.mqml.data.backend.controller;

import com.azure.identity.DeviceCodeCredential;
import com.azure.identity.DeviceCodeCredentialBuilder;
import com.azure.identity.OnBehalfOfCredential;
import com.azure.identity.OnBehalfOfCredentialBuilder;
import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadAuthenticationProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.graph.models.User;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import diy.mqml.data.backend.service.AppWebSecurityAzureService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;


import static org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient;

@RequestMapping("/api")
@RestController
public class SampleController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SampleController.class);
    private static final String GRAPH_ME_ENDPOINT = "https://graph.microsoft.com/v1.0/me";
    private static final String GRAPH_ME_FILES = "https://graph.microsoft.com/v1.0/me/photo/$value";
    private static final String CUSTOM_LOCAL_FILE_ENDPOINT = "http://localhost:8082/webapiB";
    private final WebClient webClient;
    private final OAuth2AuthorizedClientManager auth2AuthorizedClientManager;
    private final AppWebSecurityAzureService appWebSecurityAzureService;

    public SampleController(WebClient webClient, OAuth2AuthorizedClientManager auth2AuthorizedClientManager, AppWebSecurityAzureService appWebSecurityAzureService) {
        this.webClient = webClient;
        this.auth2AuthorizedClientManager = auth2AuthorizedClientManager;

        this.appWebSecurityAzureService = appWebSecurityAzureService;

    }

    @GetMapping("call-graph-with-obo")
    public void testing(@AuthenticationPrincipal Jwt jwt){
        final String clientId = this.appWebSecurityAzureService.findClientId().orElse(null);
        final String tenantId = this.appWebSecurityAzureService.findTenantId().orElse(null); // or "common" for multi-tenant apps
        final String clientSecret = this.appWebSecurityAzureService.findClientSecret().orElse(null);
        final String[] scopes = new String[] {"https://graph.microsoft.com/.default"};

// This is the incoming token to exchange using on-behalf-of flow
        final String oboToken = jwt.getTokenValue();

        final OnBehalfOfCredential credential = new OnBehalfOfCredentialBuilder()
                .clientId(clientId).tenantId(tenantId).clientSecret(clientSecret)
                .userAssertion(oboToken).build();

//        if (null == scopes || null == credential) {
//            throw new Exception("Unexpected error");
//        }

        final GraphServiceClient graphClient = new GraphServiceClient(credential, scopes);

        // Get user profile
        User me = graphClient.me().get();

// List user's files

        int i = 0;
    }


    /**
     * Call the graph resource with OAuth2AuthorizedClientManager.
     *
     * @return Response with graph data
     */
//    @PreAuthorize("hasAuthority('SCOPE_Obo.Graph.Read')")
    @GetMapping("call-graph-with-authorized-client-manager")
    public String callGraphWithAuthorizedClientManager() throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        ServletRequestAttributes sra = (ServletRequestAttributes) requestAttributes;
        HttpServletRequest servletRequest = sra.getRequest();
        HttpServletResponse servletResponse = sra.getResponse();

        OAuth2AuthorizeRequest authorizeRequest =
                OAuth2AuthorizeRequest.withClientRegistrationId("graph")
                        .principal(authentication)
                        .attributes(attrs -> {
                            attrs.put(HttpServletRequest.class.getName(), servletRequest);
                            attrs.put(HttpServletResponse.class.getName(), servletResponse);
                        })
                        .build();
        OAuth2AuthorizedClient graph = this.auth2AuthorizedClientManager.authorize(authorizeRequest);


        String body = webClient
                .get()
                .uri(GRAPH_ME_FILES)
                .attributes(oauth2AuthorizedClient(graph))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        JsonNode userInfo = mapper.readTree(body);

        return callMicrosoftGraphMeEndpoint(graph);
    }

    /**
     * Call the graph resource with @RegisteredOAuth2AuthorizedClient.
     *
     * @param graph authorized client for Graph
     * @return Response with graph data
     */
//    @PreAuthorize("hasAuthority('SCOPE_Obo.Graph.Read')")
    @GetMapping("call-graph")
    public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graph) {
        String s = callMicrosoftGraphMeEndpoint(graph);
        return s;
    }

    /**
     * Call custom resources, combine all the response and return.
     *
     * @param webapiBClient authorized client for Custom
     * @return Response Graph and Custom data.
     */
//    @PreAuthorize("hasAuthority('SCOPE_Obo.WebApiA.ExampleScope')")
    @GetMapping("webapiA/webapiB")
    public String callCustom(
            @RegisteredOAuth2AuthorizedClient("webapiB") OAuth2AuthorizedClient webapiBClient) {
        return callWebApiBEndpoint(webapiBClient);
    }

    /**
     * Call microsoft graph me endpoint
     *
     * @param graph Authorized Client
     * @return Response string data.
     */
    private String callMicrosoftGraphMeEndpoint(OAuth2AuthorizedClient graph) {
        if (null != graph) {
            String body = webClient
                    .get()
                    .uri(GRAPH_ME_ENDPOINT)
                    .attributes(oauth2AuthorizedClient(graph))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            LOGGER.info("Response from Graph: {}", body);
            return "Graph response " + (null != body ? "success." : "failed.");
        } else {
            return "Graph response failed.";
        }
    }

    /**
     * Call custom local file endpoint
     *
     * @param webapiBClient Authorized Client
     * @return Response string data.
     */
    private String callWebApiBEndpoint(OAuth2AuthorizedClient webapiBClient) {
        if (null != webapiBClient) {
            String body = webClient
                    .get()
                    .uri(CUSTOM_LOCAL_FILE_ENDPOINT)
                    .attributes(oauth2AuthorizedClient(webapiBClient))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            LOGGER.info("Response from webapiB: {}", body);
            return "webapiB response " + (null != body ? "success." : "failed.");
        } else {
            return "webapiB response failed.";
        }
    }

}
