package com.bookReview.Service;

import com.bookReview.dto.BookCreateDto;
import com.bookReview.dto.BookDto;
import com.bookReview.dto.BookUpdateDto;
import com.bookReview.Entity.enums.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface BookService {
    Page<BookDto> getBooks(BookStatus status, String genre, String title, Pageable pageable);

    BookDto getBookById(UUID id);

    BookDto createBook(BookCreateDto createDto);

    BookDto updateBook(UUID id, BookUpdateDto updateDto);

    String uploadCover(MultipartFile file);

    void deleteBook(UUID id);
}
