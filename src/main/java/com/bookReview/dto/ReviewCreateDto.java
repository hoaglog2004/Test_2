package com.bookReview.dto;

import com.bookReview.Entity.enums.ReviewStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class ReviewCreateDto {

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Reviewer name is required")
    private String reviewerName;

    private List<String> tags;

    @NotNull(message = "Status is required")
    private ReviewStatus status;

    @NotNull(message = "Book ID is required")
    private UUID bookId;
}
