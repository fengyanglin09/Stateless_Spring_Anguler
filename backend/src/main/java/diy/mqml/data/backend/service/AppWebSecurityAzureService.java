package diy.mqml.data.backend.service;


import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadAuthenticationProperties;
import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadCredentialProperties;
import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadProfileProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
//@Profile("azure-oauth2-authorization-code")
public class AppWebSecurityAzureService {
    private final AadAuthenticationProperties authenticationProperties;

    public AppWebSecurityAzureService(AadAuthenticationProperties authenticationProperties) {
        this.authenticationProperties = authenticationProperties;
    }

    public Optional<String> findClientId() {
        return findCredentialProperties()
                .map(AadCredentialProperties::getClientId);
    }

    public Optional<String> findClientSecret() {
        return findCredentialProperties()
                .map(AadCredentialProperties::getClientSecret);
    }

    public Optional<String> findTenantId() {
        return findProfileProperties()
                .map(AadProfileProperties::getTenantId);
    }

    private Optional<AadCredentialProperties> findCredentialProperties() {
        return Optional.ofNullable(authenticationProperties.getCredential());
    }

    public Optional<AadProfileProperties> findProfileProperties() {
        return Optional.ofNullable(authenticationProperties.getProfile());
    }
}
