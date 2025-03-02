export interface Movie {
  id: string;
  title: string;
  genre?: string[];
  year?: number;
  director?: string;
  userRating?: number;
  posterUrl?: string;
  watched: boolean;
  watchedDate?: Date;
  notes?: string;
  imdbId?: string;
}

export interface MovieWithGenres extends Movie {
  genres: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieSearchResult {
  id: string;
  title: string;
  year: number | string;
  poster: string;
}

export interface MovieDetails {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string[];
  plot?: string;
  poster: string;
}

export interface WatchlistItem {
  id: string;
  uid?: string;
  title: string;
  year?: number;
  posterUrl?: string;
  director?: string;
  genre?: string[];
  addedDate: Date;
  imdbId?: string;
  imdbRating?: number; // Add this line

}
export interface ShareCollectionInput {
  sharedWithEmail: string;
  permissionLevel: 'read' | 'edit';
}

export interface SharedCollection {
  id: string;
  ownerId: string;
  sharedWithId: string;
  sharedWithEmail: string;
  permissionLevel: 'read' | 'edit';
  createdAt: Date;
}