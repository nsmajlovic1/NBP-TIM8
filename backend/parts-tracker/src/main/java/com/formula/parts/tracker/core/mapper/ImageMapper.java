package com.formula.parts.tracker.core.mapper;

import com.formula.parts.tracker.dao.model.Image;
import com.formula.parts.tracker.shared.dto.image.ImageRequest;
import com.formula.parts.tracker.shared.dto.image.ImageResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    Image toEntity(ImageRequest request);

    //@Mapping(target = "base64Image", source = "data", qualifiedByName = "encodeToBase64")
    ImageResponse toResponse(Image image);

    @Named("encodeToBase64")
    static String encodeToBase64(byte[] data) {
        return data != null ? Base64.getEncoder().encodeToString(data) : null;
    }
}
