package com.formula.parts.tracker.dao.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Image extends Base {
    private Long assignId;
    private String assignType;
    private byte[] data;
    private String extension;
}
