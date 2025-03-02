import React, { useState, useEffect } from 'react';
import { movieService } from '../components/movies/services/MovieServices';
import { MovieWithGenres } from '../types';
import MovieCard from '../components/movies/MoviesCard';

interface SharedMoviesPageProps {
  // Add any props if needed
}

const SharedMoviesPage: React.FC<SharedMoviesPageProps> = () => {
  const [sharedMovies, setSharedMovies] = useState<MovieWithGenres[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSharedMovies();
  }, []);

  const fetchSharedMovies = async () => {
    try {
      setLoading(true);
      const { movies } = await movieService.getSharedWithMe();
      setSharedMovies(movies);
      setError(null);
    } catch (err) {
      console.error('Error fetching shared movies:', err);
      setError('Failed to load shared movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = sharedMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    movie.genres?.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc'
        ? (a.userRating || 0) - (b.userRating || 0)
        : (b.userRating || 0) - (a.userRating || 0);
    } else {
      // Sort by date
      const dateA = a.watchedDate ? new Date(a.watchedDate).getTime() : 0;
      const dateB = b.watchedDate ? new Date(b.watchedDate).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  // Group movies by owner
  const moviesByOwner: Record<string, MovieWithGenres[]> = {};
  sortedMovies.forEach(movie => {
    const ownerEmail = (movie as any).ownerEmail || 'Unknown';
    if (!moviesByOwner[ownerEmail]) {
      moviesByOwner[ownerEmail] = [];
    }
    moviesByOwner[ownerEmail].push(movie);
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shared With Me</h1>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Search movies, directors, or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="input py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'rating' | 'date')}
          >
            <option value="date">Date Added</option>
            <option value="title">Title</option>
            <option value="rating">Rating</option>
          </select>
          
          <button
            className="p-2 border border-gray-300 rounded bg-white"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(moviesByOwner).length > 0 ? (
            Object.entries(moviesByOwner).map(([ownerEmail, movies]) => (
              <div key={ownerEmail} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 px-4 py-2 bg-gray-100 rounded-lg">
                  Shared by: {ownerEmail}
                </h2>
                <div className="space-y-4">
                  {movies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      // We don't allow deletion of shared movies
                      shared={true}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No shared movies found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? "No shared movies match your search criteria." 
                  : "No one has shared their movie collection with you yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SharedMoviesPage;