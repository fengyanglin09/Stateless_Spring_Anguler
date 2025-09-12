package diy.mqml.data.springsecurityauthorizationcoderesourceserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringSecurityAuthorizationCodeResourceServerApplication {

    private static final String[] APPLICATION_PROFILES = {
        "spring-data-core",
        "security-frontend-code-flow"
    };

    public static void main(String[] args) {

        SpringApplication app = new SpringApplication(SpringSecurityAuthorizationCodeResourceServerApplication.class);
        app.setAdditionalProfiles(
            APPLICATION_PROFILES
        );
        app.run(args);

    }

}
