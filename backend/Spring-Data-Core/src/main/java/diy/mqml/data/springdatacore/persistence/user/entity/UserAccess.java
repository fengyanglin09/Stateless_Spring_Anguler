package diy.mqml.data.springdatacore.persistence.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;


@Setter
@Getter
@Accessors(fluent = true)
@Entity
@Table(name = "UserAccess")
public class UserAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Add an id if you want a primary key, otherwise use composite key

    @Column(name = "AppUser_id", nullable = false)
    private Long appUserId;

    @Column(name = "accessDateTime", nullable = false)
    private LocalDateTime accessDateTime;

}
