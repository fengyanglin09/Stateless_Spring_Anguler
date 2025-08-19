package diy.mqml.data.springdatacore.persistence.user.entity;

import java.util.Set;

public interface User {

    Long getId();

    int getVersion();

    String getLastname();

    String getFirstname();

    String getFullname();

    String getDisplayname();

    String getLanId();

    String getEmailAddress();

    String getDepartment();

    String getJobTitle();

    Set<UserRole> getRoles();
}
