-- =============================================================
-- DATABASE SCHEMA: HAIBAZO MANAGEMENT SYSTEM
-- Description: Schema for Authors, Books, and Reviews
-- Database: PostgreSQL (Optimized for UUID and Array types)
-- =============================================================

-- 0. Xóa các bảng cũ nếu đã tồn tại (để reset database khi cần)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- 1. Tạo bảng authors (Tác giả)
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng books (Sách)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL, 
    description TEXT,
    cover_image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'DRAFT', -- PUBLISHED, DRAFT, ARCHIVED
    genre VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo bảng reviews (Đánh giá sách)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE, 
    reviewer_name VARCHAR(255) NOT NULL, 
    rating DECIMAL(3,1) CHECK (rating >= 1 AND rating <= 5), 
    content TEXT,
    tags TEXT[], -- Lưu mảng: {'Fiction', 'Hot', 'New'}
    status VARCHAR(50) DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tạo Index để tối ưu hóa tốc độ tìm kiếm
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_books_status ON books(status);

-- 5. Dữ liệu mẫu (Seed Data) để kiểm tra API
-- Chèn Tác giả
INSERT INTO authors (name, short_bio) VALUES 
('J.K. Rowling', 'British author, best known for the Harry Potter series.'),
('George R.R. Martin', 'American novelist and short story writer in the fantasy genre.');

-- Chèn Sách (Lấy ID của tác giả vừa tạo)
INSERT INTO books (title, author_id, description, status, genre) VALUES 
('Harry Potter and the Philosopher Stone', (SELECT id FROM authors WHERE name = 'J.K. Rowling'), 'The first novel in the Harry Potter series.', 'PUBLISHED', 'Fantasy'),
('A Game of Thrones', (SELECT id FROM authors WHERE name = 'George R.R. Martin'), 'The first novel in A Song of Ice and Fire.', 'PUBLISHED', 'Epic Fantasy');

-- Chèn Review
INSERT INTO reviews (book_id, reviewer_name, rating, content, tags) VALUES 
((SELECT id FROM books WHERE title = 'Harry Potter and the Philosopher Stone'), 'Long Ho', 5.0, 'Tuyệt vời, tuổi thơ của tôi!', '{"Classic", "Magic"}'),
((SELECT id FROM books WHERE title = 'A Game of Thrones'), 'Admin', 4.5, 'Cốt truyện rất lôi cuốn nhưng hơi bạo lực.', '{"Fantasy", "Dark"}');