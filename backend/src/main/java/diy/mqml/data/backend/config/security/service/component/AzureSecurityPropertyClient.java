package diy.mqml.data.backend.config.security.service.component;


import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadAuthenticationProperties;
import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadCredentialProperties;
import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadProfileProperties;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AzureSecurityPropertyClient {
    private final AadAuthenticationProperties authenticationProperties;

    public AzureSecurityPropertyClient(AadAuthenticationProperties authenticationProperties) {
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
