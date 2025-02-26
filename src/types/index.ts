

export interface Movie {
  id: string;
  title: string;
  year?: number;
  director?: string;
  genre?: string[];
  userRating: number;
  posterUrl?: string;
  watched: boolean;
  watchedDate?: Date;
  notes?: string;
  imdbId?: string; // Added to link to external database
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface WatchlistItem {
  id: string;
  title: string;
  year?: number;
  posterUrl?: string;
  director?: string;
  genre?: string[];
  addedDate: Date;
  imdbId?: string;
  imdbRating?: number; // Add this line

}