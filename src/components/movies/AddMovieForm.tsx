import React, { useState, useEffect } from 'react';
import { Movie } from '../../types';
import { useMovieApi, MovieSearchResult } from '../../hooks/useMovieApi';
import { useDebounce } from '../../hooks/useDebounce';

interface AddMovieFormProps {
  onSubmit: (movie: Omit<Movie, 'id'>) => void;
  onCancel: () => void;
}

const AddMovieForm: React.FC<AddMovieFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number | undefined>(undefined);
  const [director, setDirector] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [posterUrl, setPosterUrl] = useState('');
  const [watchedDate, setWatchedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [imdbId, setImdbId] = useState('');
  
  // Movie suggestions state
  const [suggestions, setSuggestions] = useState<MovieSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedSearchTerm = useDebounce(title, 500);
  const { searchMovies, getMovieDetails, isLoading } = useMovieApi();
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length > 2) {
        const results = await searchMovies(debouncedSearchTerm);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    fetchSuggestions();
    // Remove searchMovies from the dependency array to avoid infinite loop
  }, [debouncedSearchTerm]); // Only depend on the search term
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const movie: Omit<Movie, 'id'> = {
      title,
      year,
      director,
      genre: genres,
      userRating: rating,
      posterUrl,
      watched: true,
      watchedDate: watchedDate ? new Date(watchedDate) : undefined,
      notes,
      imdbId
    };
    
    onSubmit(movie);
  };
  
  const handleSelectMovie = async (movie: MovieSearchResult) => {
    setTitle(movie.title);
    setYear(typeof movie.year === 'string' ? parseInt(movie.year, 10) : movie.year);
    setPosterUrl(movie.poster);
    setImdbId(movie.id);
    setShowSuggestions(false);
    
    // Fetch additional details
    const details = await getMovieDetails(movie.id);
    if (details) {
      setDirector(details.director);
      setGenres(details.genre);
      setGenreInput(details.genre.join(', '));
      
      // Add placeholder for notes with movie plot
      setNotes(details.plot || '');
    }
  };
  
  const handleAddGenre = () => {
    if (genreInput.trim()) {
      const newGenres = genreInput
        .split(',')
        .map(g => g.trim())
        .filter(g => g && !genres.includes(g));
      
      if (newGenres.length) {
        setGenres([...genres, ...newGenres]);
        setGenreInput('');
      }
    }
  };
  
  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };
  
  const handleGenreInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddGenre();
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Add New Movie</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label htmlFor="title" className="form-label">Movie Title</label>
          <input
            type="text"
            id="title"
            className="input w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            required
          />
          
          {isLoading && (
            <div className="absolute right-3 top-9">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          {showSuggestions && (
            <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectMovie(movie)}
                >
                  <div className="flex-shrink-0 w-10 h-14 mr-3">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-movie.png';
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{movie.title}</div>
                    <div className="text-sm text-gray-500">{movie.year}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="form-label">Release Year</label>
            <input
              type="number"
              id="year"
              className="input"
              value={year || ''}
              onChange={(e) => setYear(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label htmlFor="director" className="form-label">Director</label>
            <input
              type="text"
              id="director"
              className="input"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-4 mt-4">
          <label className="form-label">Genres</label>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="input flex-grow"
              placeholder="Add genre (comma separated)"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={handleGenreInputKeyDown}
            />
            <button
              type="button"
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={handleAddGenre}
            >
              Add
            </button>
          </div>
          
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {genre}
                  <button
                    type="button"
                    className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center hover:bg-blue-200"
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    <svg className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="rating" className="form-label">Your Rating</label>
          <div className="flex items-center">
            <input
              type="range"
              id="rating"
              className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
            />
            <span className="ml-2 font-medium text-lg w-10 text-center">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="posterUrl" className="form-label">Poster URL</label>
          <div className="flex space-x-4">
            <input
              type="text"
              id="posterUrl"
              className="input flex-grow"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://..."
            />
            {posterUrl && (
              <div className="flex-shrink-0 w-16 h-24 border rounded overflow-hidden">
                <img
                  src={posterUrl}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-movie.png';
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="watchedDate" className="form-label">Date Watched</label>
          <input
            type="date"
            id="watchedDate"
            className="input"
            value={watchedDate}
            onChange={(e) => setWatchedDate(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            className="input w-full h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Your thoughts on this movie..."
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Movie
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovieForm;