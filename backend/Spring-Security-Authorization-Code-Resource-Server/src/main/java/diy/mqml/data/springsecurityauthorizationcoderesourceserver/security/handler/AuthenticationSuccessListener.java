package diy.mqml.data.springsecurityauthorizationcoderesourceserver.security.handler;

import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;


/**
 *
 * note, in a stateless application, this listener is fired every time a user is authenticated, which may be for every request if no session is maintained.
 *
 * */
@Component
public class AuthenticationSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {
    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        // Custom logic after successful authentication
        System.out.println("User authenticated: " + event.getAuthentication().getName());
        // Add your post-authentication logic here
    }
}
