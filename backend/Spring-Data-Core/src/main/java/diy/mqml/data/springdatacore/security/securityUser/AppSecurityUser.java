package diy.mqml.data.springdatacore.security.securityUser;

import java.util.List;


public interface AppSecurityUser {
    String getId();

    Object getApplicationId();

    default <T> T getApplicationId(Class<T> type) {
        Object applicationId = this.getApplicationId();
        return (T)(type != null && applicationId != null && type.isAssignableFrom(applicationId.getClass()) ? type.cast(applicationId) : null);
    }

    String getLanId();

    String getPersonId();

    String getSystemId();

    String getFullName();

    String getLastName();

    String getFirstName();

    String getDepartment();

    String getJobTitle();

    String getWorkSiteState();

    String getWorkSiteCity();

    String getMailLocation();

    String getEmailAddress();

    List<String> getRoles();

    byte[] getPhoto();

    default boolean hasPhoto() {
        byte[] photo = this.getPhoto();
        return photo != null && photo.length > 0;
    }
}
