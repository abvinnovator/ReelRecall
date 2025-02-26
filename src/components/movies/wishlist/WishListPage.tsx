import React, { useState } from 'react';
import { WatchlistItem as WatchlistItemType } from "../../../types/index"
import WatchlistItemComponent from './WishListComponent';
import { useMovieApi, MovieSearchResult } from '../../../hooks/useMovieApi';
import { useDebounce } from '../../../hooks/useDebounce';

interface WatchlistPageProps {
  watchlist: WatchlistItemType[];
  onAddToWatchlist: (item: Omit<WatchlistItemType, 'id'>) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onMarkAsWatched: (item: WatchlistItemType) => void;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onMarkAsWatched
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { searchMovies, isLoading } = useMovieApi();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  // Perform search when debounced search term changes
  React.useEffect(() => {
    const fetchMovies = async () => {
      if (debouncedSearchTerm.length > 2) {
        const results = await searchMovies(debouncedSearchTerm);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    fetchMovies();
  }, [debouncedSearchTerm, searchMovies]);

  // Add to watchlist
  const handleAddToWatchlist = (movie: MovieSearchResult) => {
    const newItem: Omit<WatchlistItemType, 'id'> = {
      title: movie.title,
      year: typeof movie.year === 'string' ? parseInt(movie.year, 10) : movie.year,
      posterUrl: movie.poster,
      addedDate: new Date(),
      imdbId: movie.id
    };
    
    onAddToWatchlist(newItem);
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">My Watchlist</h1>
        
        <div className="relative w-full md:w-96">
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Search for movies to add..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          {isLoading && isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-80 overflow-y-auto">
              {searchResults.map((movie) => {
                const isAlreadyInWatchlist = watchlist.some(item => item.imdbId === movie.id);
                return (
                  <div
                    key={movie.id}
                    className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-12 h-16 mr-3">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-movie.png';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-sm text-gray-500">{movie.year}</div>
                    </div>
                    <button
                      onClick={() => handleAddToWatchlist(movie)}
                      className={`px-3 py-1 rounded text-sm ${
                        isAlreadyInWatchlist 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      disabled={isAlreadyInWatchlist}
                    >
                      {isAlreadyInWatchlist ? 'Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map(item => (
            <WatchlistItemComponent
              key={item.id}
              item={item}
              onRemove={onRemoveFromWatchlist}
              onMarkAsWatched={onMarkAsWatched}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Your watchlist is empty</h3>
          <p className="text-gray-500 mb-6">
            Search for movies above to add them to your watchlist.
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;