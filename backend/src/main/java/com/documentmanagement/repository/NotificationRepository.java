package com.documentmanagement.repository;

import com.documentmanagement.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByOrderByTimestampDesc();
    List<Notification> findByIsReadFalseOrderByTimestampDesc();
    long countByIsReadFalse();
}
