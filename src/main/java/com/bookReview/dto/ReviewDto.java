package com.bookReview.dto;

import com.bookReview.Entity.enums.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private UUID id;
    private Integer rating;
    private String content;
    private String reviewerName;
    private List<String> tags;
    private ReviewStatus status;
    private UUID bookId;
}
