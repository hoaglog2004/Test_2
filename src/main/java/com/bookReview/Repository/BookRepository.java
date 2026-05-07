package com.bookReview.Repository;

import com.bookReview.dto.GenreInsightDto;
import com.bookReview.Entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {

    @Query("SELECT new com.bookReview.dto.GenreInsightDto(b.genre, COUNT(b)) FROM Book b GROUP BY b.genre")
    List<GenreInsightDto> countBooksByGenre();

    int countByAuthorId(UUID authorId);
}
