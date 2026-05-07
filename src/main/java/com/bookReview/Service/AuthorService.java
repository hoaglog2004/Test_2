package com.bookReview.Service;

import com.bookReview.dto.AuthorCreateDto;
import com.bookReview.dto.AuthorDto;

import java.util.List;
import java.util.UUID;

public interface AuthorService {
    List<AuthorDto> getAllAuthors();

    AuthorDto createAuthor(AuthorCreateDto createDto);

    AuthorDto getAuthorById(UUID id);
}
