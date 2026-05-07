package com.bookReview.dto;

import com.bookReview.Entity.enums.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private UUID id;
    private String title;
    private String description;
    private String coverImageUrl;
    private BookStatus status;
    private String genre;
    private AuthorDto author;
}
