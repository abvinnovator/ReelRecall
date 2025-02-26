import React from 'react';
import { WatchlistItem } from '../../../types';

interface WatchlistItemProps {
  item: WatchlistItem;
  onRemove: (id: string) => void;
  onMarkAsWatched: (item: WatchlistItem) => void;
}

const WatchlistItemComponent: React.FC<WatchlistItemProps> = ({
  item,
  onRemove,
  onMarkAsWatched
}) => {
  return (
    <div className="card overflow-hidden flex flex-col h-full transition-transform hover:shadow-md">
      <div className="relative pb-[150%] bg-gray-100">
        <img
          src={item.posterUrl || '/placeholder-movie.png'}
          alt={item.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-movie.png';
          }}
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 bg-white rounded-full shadow hover:bg-red-100 transition-colors"
            title="Remove from watchlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {item.imdbRating && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">
            ⭐ {item.imdbRating}
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
        <p className="text-gray-500 text-sm mb-4">
          {item.year}
          {item.director && ` • ${item.director}`}
        </p>
        
        {item.genre && item.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.genre.map(g => (
              <span 
                key={g} 
                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
              >
                {g}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-auto">
          Added on {item.addedDate.toLocaleDateString()}
        </p>
      </div>
      
      <div className="p-4 pt-0">
        <button
          onClick={() => onMarkAsWatched(item)}
          className="w-full py-2 px-4 bg-green-100 rounded text-green-700 font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Mark as Watched
        </button>
      </div>
    </div>
  );
};

export default WatchlistItemComponent;