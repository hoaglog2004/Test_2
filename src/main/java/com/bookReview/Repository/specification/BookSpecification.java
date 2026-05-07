package com.bookReview.Repository.specification;

import com.bookReview.Entity.Book;
import com.bookReview.Entity.enums.BookStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class BookSpecification {

    public static Specification<Book> hasStatus(BookStatus status) {
        return (root, query, criteriaBuilder) -> status == null ? null
                : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Book> hasGenre(String genre) {
        return (root, query, criteriaBuilder) -> !StringUtils.hasText(genre) ? null
                : criteriaBuilder.equal(criteriaBuilder.lower(root.get("genre")), genre.toLowerCase());
    }

    public static Specification<Book> hasTitleContaining(String title) {
        return (root, query, criteriaBuilder) -> !StringUtils.hasText(title) ? null
                : criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Book> filterBy(BookStatus status, String genre, String title) {
        return Specification.where(hasStatus(status))
                .and(hasGenre(genre))
                .and(hasTitleContaining(title));
    }
}
