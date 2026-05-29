package com.documentmanagement.controller;

import com.documentmanagement.model.Document;
import com.documentmanagement.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {

    private final FileService fileService;

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        try {
            List<Document> documents = fileService.getAllDocuments();
            log.info("Retrieved {} documents", documents.size());
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            log.error("Error fetching documents", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        try {
            Document document = fileService.getDocument(id);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            log.error("Error fetching document", e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            fileService.deleteFile(id);
            log.info("Document deleted: {}", id);
            return ResponseEntity.ok().body(new ApiResponse("Document deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting document", e);
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
