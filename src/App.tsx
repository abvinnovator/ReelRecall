import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MoviesPage from './pages/MoviesPage';
import ImportPage from './pages/ImportPage';
import { Movie } from './types';

// Mock data for initial development
const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    year: 2010,
    director: 'Christopher Nolan',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    userRating: 9.2,
    posterUrl: 'https://via.placeholder.com/150x225?text=Inception',
    watched: true,
    watchedDate: new Date('2020-10-15'),
    notes: 'Mind-bending plot with amazing visuals.'
  },
  {
    id: '2',
    title: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
    genre: ['Drama'],
    userRating: 9.5,
    posterUrl: 'https://via.placeholder.com/150x225?text=Shawshank',
    watched: true,
    watchedDate: new Date('2019-08-12'),
    notes: 'One of the greatest movies of all time.'
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  const handleAddMovie = (newMovie: Omit<Movie, 'id'>) => {
    const movie: Movie = {
      ...newMovie,
      id: Date.now().toString() // Simple ID generator for now
    };
    
    setMovies([...movies, movie]);
  };
  
  const handleDeleteMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/movies" /> : <LoginPage onLogin={handleLogin} />
            } />
            <Route path="/signup" element={
              isLoggedIn ? <Navigate to="/movies" /> : <SignupPage onSignup={handleLogin} />
            } />
            <Route path="/movies" element={
              isLoggedIn ? (
                <MoviesPage 
                  movies={movies} 
                  onAddMovie={handleAddMovie} 
                  onDeleteMovie={handleDeleteMovie} 
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/import" element={
              isLoggedIn ? <ImportPage onImportMovies={(importedMovies) => setMovies([...movies, ...importedMovies])} /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} MovieTracker. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;