package com.documentmanagement.controller;

import com.documentmanagement.model.Document;
import com.documentmanagement.service.FileService;
import com.documentmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<?> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            log.info("Uploading {} files", files.length);

            // Upload files
            List<Document> uploadedDocuments = new java.util.ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    Document doc = fileService.uploadFile(file);
                    uploadedDocuments.add(doc);
                    log.info("File uploaded: {}", doc.getFileName());
                } catch (Exception e) {
                    log.error("Error uploading file: {}", file.getOriginalFilename(), e);
                }
            }

            // Send notification asynchronously
            processUploadNotification(files.length, uploadedDocuments.size());

            return ResponseEntity.ok().body(new ApiResponse("Files uploaded successfully", uploadedDocuments));
        } catch (Exception e) {
            log.error("Upload error", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Upload failed: " + e.getMessage(), null));
        }
    }

    @Async
    private void processUploadNotification(int totalFiles, int successCount) {
        try {
            // Simulate processing delay for bulk uploads
            if (totalFiles > 3) {
                Thread.sleep(2000);
            }

            String message = successCount + " file" + (successCount > 1 ? "s" : "") + " uploaded successfully";
            notificationService.createNotification(message, "success");
        } catch (InterruptedException e) {
            log.error("Notification processing error", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        try {
            Document document = fileService.getDocument(id);
            byte[] fileData = fileService.downloadFile(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileData);
        } catch (Exception e) {
            log.error("Download error", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Download failed: " + e.getMessage(), null));
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
