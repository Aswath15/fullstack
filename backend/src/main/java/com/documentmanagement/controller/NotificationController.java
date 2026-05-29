package com.documentmanagement.controller;

import com.documentmanagement.model.Notification;
import com.documentmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        try {
            List<Notification> notifications = notificationService.getAllNotifications();
            log.info("Retrieved {} notifications", notifications.size());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        try {
            List<Notification> notifications = notificationService.getUnreadNotifications();
            log.info("Retrieved {} unread notifications", notifications.size());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching unread notifications", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        try {
            long count = notificationService.getUnreadCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error getting unread count", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            log.info("Notification marked as read: {}", id);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            log.error("Error marking notification as read", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Mark as read failed: " + e.getMessage(), null));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        try {
            notificationService.markAllAsRead();
            log.info("All notifications marked as read");
            return ResponseEntity.ok(new ApiResponse("All notifications marked as read", null));
        } catch (Exception e) {
            log.error("Error marking all notifications as read", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Mark all as read failed: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            log.info("Notification deleted: {}", id);
            return ResponseEntity.ok(new ApiResponse("Notification deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting notification", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Delete failed: " + e.getMessage(), null));
        }
    }

    static class ApiResponse {
        public String message;
        public Object data;

        public ApiResponse(String message, Object data) {
            this.message = message;
            this.data = data;
        }
    }
}
