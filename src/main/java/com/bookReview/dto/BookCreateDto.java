package com.bookReview.dto;

import com.bookReview.Entity.enums.BookStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookCreateDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String coverImageUrl;

    @NotNull(message = "Status is required")
    private BookStatus status;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotNull(message = "Author ID is required")
    private UUID authorId;
}
