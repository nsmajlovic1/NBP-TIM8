package com.formula.parts.tracker.core.service.image;

import com.formula.parts.tracker.dao.model.Image;
import com.formula.parts.tracker.shared.dto.image.ImageRequest;
import com.formula.parts.tracker.shared.dto.image.ImageResponse;
import com.formula.parts.tracker.shared.exception.ApiException;

import java.util.List;

public interface ImageService {
    ImageResponse upload(ImageRequest request);
    ImageResponse getImage(Long assignId, String assignType);
    void deleteImage (Long id) throws ApiException;

    Image getImageById(Long id) throws ApiException;
    List<ImageResponse> getImagesByAssign(Long assignId, String assignType);
}
