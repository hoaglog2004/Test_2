package com.bookReview.Service.impl;

import com.bookReview.dto.ReviewCreateDto;
import com.bookReview.dto.ReviewDto;
import com.bookReview.Entity.Book;
import com.bookReview.Entity.Review;
import com.bookReview.exception.ResourceNotFoundException;
import com.bookReview.Repository.BookRepository;
import com.bookReview.Repository.ReviewRepository;
import com.bookReview.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    @Override
    public ReviewDto createReview(ReviewCreateDto createDto) {
        Book book = bookRepository.findById(createDto.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + createDto.getBookId()));

        Review review = new Review();
        review.setRating(createDto.getRating());
        review.setContent(createDto.getContent());
        review.setReviewerName(createDto.getReviewerName());
        review.setTags(createDto.getTags());
        review.setStatus(createDto.getStatus());
        review.setBook(book);

        Review savedReview = reviewRepository.save(review);
        return mapToDto(savedReview);
    }

    @Override
    public List<ReviewDto> getReviewsByBookId(UUID bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ReviewDto> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(this::mapToDto);
    }

    private ReviewDto mapToDto(Review review) {
        UUID bookId = review.getBook() != null ? review.getBook().getId() : null;
        return new ReviewDto(review.getId(), review.getRating(), review.getContent(),
                review.getReviewerName(), review.getTags(), review.getStatus(), bookId);
    }
}
