import React, { useState } from 'react';
import { MovieWithGenres } from '../../types/index'

interface MovieCardProps {
  movie: MovieWithGenres;
  onEdit?: (movie: MovieWithGenres) => void;
  onDelete?: (id: string) => void;
  shared?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onEdit, onDelete }) => {
  const defaultPoster = 'https://via.placeholder.com/150x225?text=No+Poster';
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group relative"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Top section with poster and title */}
      <div className="w-full h-40 relative">
        <img 
          src={movie.posterUrl || defaultPoster} 
          alt={`${movie.title} poster`} 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Title at bottom of poster with tooltip for full title */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="relative group/title">
            <h3 className="text-sm font-bold text-white line-clamp-1">
              {movie.title} {movie.year && `(${movie.year})`}
            </h3>
            
            {/* Full title tooltip that appears on hover */}
            <div className="absolute left-0 bottom-full mb-1 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <div className="bg-gray-900 text-white text-xs p-2 rounded shadow-lg max-w-xs whitespace-normal">
                {movie.title} {movie.year && `(${movie.year})`}
              </div>
            </div>
          </div>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded text-xs font-bold">
            {movie.userRating}/10
          </span>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-2 text-xs">
        {/* Director */}
        {movie.director && (
          <p className="text-gray-700 truncate">
            <span className="font-medium">Dir:</span> {movie.director}
          </p>
        )}
        
        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((g) => (
              <span key={g} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                {g}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Notes preview with clickable indicator */}
        {movie.notes && (
          <div className="mt-1 relative group/notes">
            <p className="text-gray-600 line-clamp-1 overflow-hidden">
              {movie.notes}
              {movie.notes.length > 30 && (
                <span className="ml-1 text-primary-600 cursor-pointer">...</span>
              )}
            </p>
            
            {/* Notes tooltip/popup that appears on hover */}
            <div className="absolute left-0 top-full mt-1 opacity-0 group-hover/notes:opacity-100 transition-opacity duration-200 z-20">
              <div className="bg-white text-gray-800 text-xs p-2 rounded shadow-lg max-w-xs whitespace-normal border border-gray-200">
                {movie.notes}
              </div>
            </div>
          </div>
        )}
        
        {/* Watched date at the bottom */}
        {movie.watchedDate && (
          <p className="mt-1 text-gray-500 text-xs">
            {new Date(movie.watchedDate).toLocaleDateString()}
          </p>
        )}
      </div>
      
      {/* Expanded details panel that slides up on hover */}
      {showDetails && movie.notes && (
        <div className="absolute inset-0 bg-white bg-opacity-95 p-3 transform transition-transform duration-300 z-10 overflow-y-auto text-xs">
          <h4 className="font-bold text-sm mb-1">{movie.title} {movie.year && `(${movie.year})`}</h4>
          
          {movie.director && (
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Director:</span> {movie.director}
            </p>
          )}
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-2">
              <span className="font-medium">Genres:</span>{' '}
              {movie.genres.join(', ')}
            </div>
          )}
          
          <div className="mb-2">
            <span className="font-medium">Rating:</span>{' '}
            <span className="text-yellow-600 font-bold">{movie.userRating}/10</span>
          </div>
          
          {movie.watchedDate && (
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Watched:</span>{' '}
              {new Date(movie.watchedDate).toLocaleDateString()}
            </p>
          )}
          
          <div>
            <span className="font-medium">Notes:</span>
            <p className="text-gray-700 mt-1">{movie.notes}</p>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-20">
        {onEdit && (
          <button 
            onClick={() => onEdit(movie)} 
            className="p-1 bg-white/80 rounded-full hover:bg-white shadow-sm text-gray-700"
            aria-label="Edit movie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        
        {onDelete && (
          <button 
            onClick={() => onDelete(movie.id)} 
            className="p-1 bg-white/80 rounded-full hover:bg-white shadow-sm text-red-500"
            aria-label="Delete movie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;