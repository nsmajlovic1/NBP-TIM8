package com.formula.parts.tracker.rest;

import com.formula.parts.tracker.core.service.image.ImageService;
import com.formula.parts.tracker.dao.model.Image;
import com.formula.parts.tracker.shared.dto.image.ImageRequest;
import com.formula.parts.tracker.shared.dto.image.ImageResponse;
import com.formula.parts.tracker.shared.exception.ApiException;
import com.formula.parts.tracker.shared.success.ApiSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageRestService {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("assignId") Long assignId,
            @RequestParam("assignType") String assignType,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.getSize() > 5 * 1024 * 1024) { // 5MB = 5 * 1024 * 1024 bytes
                return ResponseEntity.badRequest()
                        .body("File size must not exceed 5MB");
            }
            ImageRequest request = new ImageRequest();
            request.setAssignId(assignId);
            request.setAssignType(assignType);
            request.setData(file.getBytes());

            String filename = file.getOriginalFilename();
            if (filename != null && filename.contains(".")) {
                String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                request.setExtension(extension);
            } else {
                request.setExtension("jpg"); // default fallback
            }

            return ResponseEntity.ok(imageService.upload(request));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/get")
    public ResponseEntity<ImageResponse> getImage(@RequestParam Long assignId, @RequestParam String assignType) {
        return ResponseEntity.ok(imageService.getImage(assignId, assignType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiSuccessResponse> deleteImage(@PathVariable Long id) throws ApiException {
        imageService.deleteImage(id);
        ApiSuccessResponse successResponse = new ApiSuccessResponse(HttpStatus.OK, "Image with ID " + id + " has been successfully deleted.");
        return ResponseEntity.ok(successResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImageById(@PathVariable Long id) throws ApiException {
        Image image = imageService.getImageById(id);
        byte[] imageData = image.getData();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(resolveMediaType(image.getExtension()));

        return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }

    @GetMapping("/assign")
    public List<ImageResponse> getImagesByAssign(@RequestParam Long assignId, @RequestParam String assignType) {
        return imageService.getImagesByAssign(assignId, assignType);
    }

    private MediaType resolveMediaType(String extension) {
        return switch (extension.toLowerCase()) {
            case "png" -> MediaType.IMAGE_PNG;
            case "gif" -> MediaType.IMAGE_GIF;
            case "bmp" -> MediaType.valueOf("image/bmp");
            case "webp" -> MediaType.valueOf("image/webp");
            default -> MediaType.IMAGE_JPEG;
        };
    }
}
