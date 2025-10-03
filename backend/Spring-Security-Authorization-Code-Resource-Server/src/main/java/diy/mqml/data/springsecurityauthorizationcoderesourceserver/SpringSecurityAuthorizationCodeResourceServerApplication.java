package diy.mqml.data.springsecurityauthorizationcoderesourceserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"diy.mqml.data"})
@EnableJpaRepositories(basePackages = "diy.mqml.data")
@EntityScan(basePackages = "diy.mqml.data")
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
