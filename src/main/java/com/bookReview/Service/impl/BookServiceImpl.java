package com.bookReview.Service.impl;

import com.bookReview.dto.AuthorDto;
import com.bookReview.dto.BookCreateDto;
import com.bookReview.dto.BookDto;
import com.bookReview.dto.BookUpdateDto;
import com.bookReview.Entity.Author;
import com.bookReview.Entity.Book;
import com.bookReview.Entity.enums.BookStatus;
import com.bookReview.exception.ResourceNotFoundException;
import com.bookReview.Repository.AuthorRepository;
import com.bookReview.Repository.BookRepository;
import com.bookReview.Repository.specification.BookSpecification;
import com.bookReview.Service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    @Override
    public Page<BookDto> getBooks(BookStatus status, String genre, String title, Pageable pageable) {
        Specification<Book> spec = BookSpecification.filterBy(status, genre, title);
        return bookRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    @Override
    public BookDto getBookById(UUID id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return mapToDto(book);
    }

    @Override
    public BookDto createBook(BookCreateDto createDto) {
        Author author = authorRepository.findById(createDto.getAuthorId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Author not found with id: " + createDto.getAuthorId()));

        Book book = new Book();
        book.setTitle(createDto.getTitle());
        book.setDescription(createDto.getDescription());
        book.setCoverImageUrl(createDto.getCoverImageUrl());
        book.setStatus(createDto.getStatus());
        book.setGenre(createDto.getGenre());
        book.setAuthor(author);

        Book savedBook = bookRepository.save(book);
        return mapToDto(savedBook);
    }

    @Override
    public BookDto updateBook(UUID id, BookUpdateDto updateDto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        if (updateDto.getTitle() != null)
            book.setTitle(updateDto.getTitle());
        if (updateDto.getDescription() != null)
            book.setDescription(updateDto.getDescription());
        if (updateDto.getCoverImageUrl() != null)
            book.setCoverImageUrl(updateDto.getCoverImageUrl());
        if (updateDto.getStatus() != null)
            book.setStatus(updateDto.getStatus());
        if (updateDto.getGenre() != null)
            book.setGenre(updateDto.getGenre());

        if (updateDto.getAuthorId() != null) {
            Author author = authorRepository.findById(updateDto.getAuthorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Author not found with id: " + updateDto.getAuthorId()));
            book.setAuthor(author);
        }

        Book updatedBook = bookRepository.save(book);
        return mapToDto(updatedBook);
    }

    @Override
    public String uploadCover(MultipartFile file) {
        try {
            Path uploadPath = Paths.get("uploads/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String newFilename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            return baseUrl + "/images/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public void deleteBook(UUID id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    private BookDto mapToDto(Book book) {
        AuthorDto authorDto = null;
        if (book.getAuthor() != null) {
            authorDto = new AuthorDto(book.getAuthor().getId(), book.getAuthor().getName(),
                    book.getAuthor().getShortBio(), 0);
        }
        return new BookDto(book.getId(), book.getTitle(), book.getDescription(),
                book.getCoverImageUrl(), book.getStatus(), book.getGenre(), authorDto);
    }
}
