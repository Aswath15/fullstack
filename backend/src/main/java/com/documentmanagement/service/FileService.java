package com.documentmanagement.service;

import com.documentmanagement.model.Document;
import com.documentmanagement.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {

    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;

    @Value("${file.upload.path}")
    private String uploadPath;

    public Document uploadFile(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        // Create upload directory if not exists
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String filename = UUID.randomUUID().toString() + "_" + originalFilename;
        Path filePath = Paths.get(uploadPath, filename);

        // Save file
        Files.write(filePath, file.getBytes());

        // Create and save document record
        Document document = Document.builder()
                .fileName(originalFilename)
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .filePath(filePath.toString())
                .status("ACTIVE")
                .build();

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAllByOrderByUploadDateDesc();
    }

    public Document getDocument(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public byte[] downloadFile(Long id) throws IOException {
        Document document = getDocument(id);
        Path filePath = Paths.get(document.getFilePath());

        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on disk");
        }

        return Files.readAllBytes(filePath);
    }

    public void deleteFile(Long id) throws IOException {
        Document document = getDocument(id);
        Path filePath = Paths.get(document.getFilePath());

        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        documentRepository.deleteById(id);
    }
}
