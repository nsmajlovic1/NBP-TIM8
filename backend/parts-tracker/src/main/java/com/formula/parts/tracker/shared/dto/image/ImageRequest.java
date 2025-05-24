package com.formula.parts.tracker.shared.dto.image;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageRequest {
    private Long assignId;
    private String assignType;
    private String extension;
    private byte[] data;
}
