import { useState } from 'react';

// Define the interface for movie search results
export interface MovieSearchResult {
  id: string;
  title: string;
  year: string | number;
  poster: string;
}

// Define the interface for detailed movie information
export interface MovieDetails {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string[];
  plot: string;
  poster: string;
  imdbRating: number;
}

export const useMovieApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Using TMDB API - you'll need to register for an API key at https://www.themoviedb.org/
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY';
  const BASE_URL = 'https://api.themoviedb.org/3';

  const searchMovies = async (query: string): Promise<MovieSearchResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      
      return data.results.map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
          : '/placeholder-movie.png'
      }));
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getMovieDetails = async (movieId: string): Promise<MovieDetails | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      const movie = await response.json();
      
      // Extract director from credits
      const director = movie.credits.crew
        .filter((person: any) => person.job === 'Director')
        .map((director: any) => director.name)
        .join(', ') || 'Unknown';
      
      return {
        id: movie.id.toString(),
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        director,
        genre: movie.genres.map((g: any) => g.name),
        plot: movie.overview,
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : '/placeholder-movie.png',
        imdbRating: movie.vote_average
      };
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    searchMovies,
    getMovieDetails
  };
};