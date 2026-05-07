package com.bookReview.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LibraryInsightsDto {
    private long totalBooks;
    private List<GenreInsightDto> booksByGenre;
}
