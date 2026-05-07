import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import BooksLibrary from './pages/BooksLibrary';
import Authors from './pages/Authors';
import AddBook from './pages/AddBook';
import CreateReview from './pages/CreateReview';
import Reviews from './pages/Reviews';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BooksLibrary />} />
          <Route path="books/new" element={<AddBook />} />
          <Route path="authors" element={<Authors />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reviews/new" element={<CreateReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
