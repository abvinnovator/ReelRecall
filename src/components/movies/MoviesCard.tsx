import React from 'react';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  onEdit?: (movie: Movie) => void;
  onDelete?: (id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onEdit, onDelete }) => {
  const defaultPoster = 'https://via.placeholder.com/150x225?text=No+Poster';

  return (
    <div className="card relative overflow-hidden group">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 flex-shrink-0">
          <img 
            src={movie.posterUrl || defaultPoster} 
            alt={`${movie.title} poster`} 
            className="w-full h-auto rounded object-cover aspect-[2/3]"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{movie.title} {movie.year && `(${movie.year})`}</h3>
            <div className="flex items-center space-x-1">
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-bold">
                {movie.userRating}/10
              </span>
            </div>
          </div>
          
          {movie.director && (
            <p className="text-gray-600 mt-1">Director: {movie.director}</p>
          )}
          
          {movie.genre && movie.genre.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {movie.genre.map((g) => (
                <span key={g} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {g}
                </span>
              ))}
            </div>
          )}
          
          {movie.notes && (
            <p className="mt-3 text-gray-700">{movie.notes}</p>
          )}
          
          {movie.watchedDate && (
            <p className="mt-2 text-sm text-gray-500">
              Watched on: {movie.watchedDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button 
            onClick={() => onEdit(movie)} 
            className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 mr-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        
        {onDelete && (
          <button 
            onClick={() => onDelete(movie.id)} 
            className="p-1 bg-red-100 rounded-full hover:bg-red-200 text-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;