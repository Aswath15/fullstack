package com.documentmanagement.service;

import com.documentmanagement.model.Notification;
import com.documentmanagement.repository.NotificationRepository;
import com.documentmanagement.websocket.NotificationWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationWebSocketHandler webSocketHandler;

    public Notification createNotification(String message, String type) {
        Notification notification = Notification.builder()
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);

        // Send notification to connected clients
        sendNotificationToClients(saved);

        return saved;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByTimestampDesc();
    }

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByTimestampDesc();
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        List<Notification> unreadNotifications = getUnreadNotifications();
        unreadNotifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    public void sendNotificationToClients(Notification notification) {
        try {
            webSocketHandler.sendToAllClients(notification);
        } catch (Exception e) {
            log.error("Failed to send notification to clients", e);
        }
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
