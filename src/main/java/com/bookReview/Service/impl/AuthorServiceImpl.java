package com.bookReview.Service.impl;

import com.bookReview.dto.AuthorCreateDto;
import com.bookReview.dto.AuthorDto;
import com.bookReview.Entity.Author;
import com.bookReview.exception.ResourceNotFoundException;
import com.bookReview.Repository.AuthorRepository;
import com.bookReview.Repository.BookRepository;
import com.bookReview.Service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    @Override
    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AuthorDto createAuthor(AuthorCreateDto createDto) {
        Author author = new Author();
        author.setName(createDto.getName());
        author.setShortBio(createDto.getShortBio());

        Author savedAuthor = authorRepository.save(author);
        return mapToDto(savedAuthor);
    }

    @Override
    public AuthorDto getAuthorById(UUID id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id));
        return mapToDto(author);
    }

    private AuthorDto mapToDto(Author author) {
        int booksPublished = bookRepository.countByAuthorId(author.getId());
        return new AuthorDto(author.getId(), author.getName(), author.getShortBio(), booksPublished);
    }
}
