package com.bookReview.Service;

import com.bookReview.dto.ReviewCreateDto;
import com.bookReview.dto.ReviewDto;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewDto createReview(ReviewCreateDto createDto);

    List<ReviewDto> getReviewsByBookId(UUID bookId);
    
    Page<ReviewDto> getAllReviews(Pageable pageable);
}
