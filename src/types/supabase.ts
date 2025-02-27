export type Movie = {
    id: string;
    user_id: string;
    title: string;
    year?: number;
    director?: string;
    genre?: string[];
    user_rating?: number;
    poster_url?: string;
    watched: boolean;
    watched_date?: string;
    notes?: string;
    created_at: string;
  };