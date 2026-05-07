package com.bookReview.Service.impl;

import com.bookReview.dto.GenreInsightDto;
import com.bookReview.dto.LibraryInsightsDto;
import com.bookReview.Repository.BookRepository;
import com.bookReview.Service.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsightServiceImpl implements InsightService {

    private final BookRepository bookRepository;

    @Override
    public LibraryInsightsDto getLibraryInsights() {
        long totalBooks = bookRepository.count();
        List<GenreInsightDto> genreInsights = bookRepository.countBooksByGenre();
        return new LibraryInsightsDto(totalBooks, genreInsights);
    }
}
