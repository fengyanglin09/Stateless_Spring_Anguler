package diy.mqml.data.springdatacore.security.securityUserSession;

import java.time.LocalDateTime;

public interface AppSecurityUserSession {

    String getId();

    LocalDateTime getAuthenticatedDateTime();

    LocalDateTime getIssuedDateTime();

    LocalDateTime getExpiredDateTime();

    default boolean isExpired() {
        return this.getExpiredDateTime() == null || this.getExpiredDateTime().isBefore(LocalDateTime.now());
    }

}
