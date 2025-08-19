package diy.mqml.data.springdatacore.security.securityUserSession;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Objects;


@Getter
@Builder
public class AppSecurityDefaultUserSession implements AppSecurityUserSession {

    private final String id;
    private final LocalDateTime authenticatedDateTime;
    private final LocalDateTime issuedDateTime;
    private final LocalDateTime expiredDateTime;

    public AppSecurityDefaultUserSession(String id, LocalDateTime authenticatedDateTime, LocalDateTime issuedDateTime, LocalDateTime expiredDateTime) {
        this.id = id;
        this.authenticatedDateTime = authenticatedDateTime;
        this.issuedDateTime = issuedDateTime;
        this.expiredDateTime = expiredDateTime;
    }


    @Override
    public String toString() {
        return "DefaultAppSecurityUserSession{" +
                "id='" + id + '\'' +
                ", authenticatedDateTime=" + authenticatedDateTime +
                ", issuedDateTime=" + issuedDateTime +
                ", expiredDateTime=" + expiredDateTime +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AppSecurityDefaultUserSession that = (AppSecurityDefaultUserSession) o;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getAuthenticatedDateTime(), that.getAuthenticatedDateTime()) && Objects.equals(getIssuedDateTime(), that.getIssuedDateTime()) && Objects.equals(getExpiredDateTime(), that.getExpiredDateTime());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getAuthenticatedDateTime(), getIssuedDateTime(), getExpiredDateTime());
    }
}
