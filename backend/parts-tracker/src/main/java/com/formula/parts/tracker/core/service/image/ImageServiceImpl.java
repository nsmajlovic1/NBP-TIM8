package com.formula.parts.tracker.core.service.image;

import com.formula.parts.tracker.core.mapper.ImageMapper;
import com.formula.parts.tracker.dao.model.Image;
import com.formula.parts.tracker.dao.repository.ImageRepository;
import com.formula.parts.tracker.shared.dto.image.ImageRequest;
import com.formula.parts.tracker.shared.dto.image.ImageResponse;
import com.formula.parts.tracker.shared.exception.ApiException;
import com.formula.parts.tracker.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    @Override
    public ImageResponse upload(ImageRequest request) {
        Image image = imageMapper.toEntity(request);
        Image saved = imageRepository.persist(image);
        return imageMapper.toResponse(saved);
    }

    @Override
    public ImageResponse getImage(Long assignId, String assignType) {
        Image image = imageRepository.findByAssign(assignId, assignType);
        return imageMapper.toResponse(image);
    }

    @Override
    public void deleteImage(Long id) throws ApiException {
        if (!imageRepository.existsById(id)) {
            throw new NotFoundException(String.format("Image with ID %d does not exist.", id));
        }
        imageRepository.deleteById(id);
    }

    @Override
    public List<ImageResponse> getImagesByAssign(Long assignId, String assignType) {
        List<Image> images = imageRepository.findAllByAssign(assignId, assignType);
        return images.stream()
                .map(imageMapper::toResponse)
                .toList();
    }

    @Override
    public Image getImageById(Long id) throws ApiException {
        if (!imageRepository.existsById(id)) {
            throw new NotFoundException(String.format("Storage with ID %d does not exist.", id));
        }
        Image image = imageRepository.findById(id);

        return image;
    }

}
