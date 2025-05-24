package com.formula.parts.tracker.shared.dto.image;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageResponse {
    private Long id;
    private Long assignId;
    private String assignType;
    private String extension;
}
