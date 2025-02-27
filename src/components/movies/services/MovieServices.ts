// src/services/movieService.ts
import { supabase } from "../../../utils/SupabaseClient";
import { Movie, MovieWithGenres } from "../../../types/index"

export interface CreateMovieInput extends Omit<Movie, 'id'> {
  genre: string[];
}

export const movieService = {
  // Get all movies for the current user
  async getMovies(): Promise<MovieWithGenres[]> {
    // Get the authenticated user's ID
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
  
    const userId = authData.user.id;
  
    // Fetch movies for the specific user
    const { data: movies, error } = await supabase
      .from('movies')
      .select(`
        *,
        movie_genres(
          genres(name)
        )
      `)
      .eq('user_id', userId) // ✅ Filter by user_id
      .order('watched_date', { ascending: false });
  
    if (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  
    // Transform the data to match our frontend model
    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      director: movie.director,
      userRating: movie.user_rating,
      posterUrl: movie.poster_url,
      watched: movie.watched,
      watchedDate: movie.watched_date ? new Date(movie.watched_date) : undefined,
      notes: movie.notes,
      imdbId: movie.imdb_id,
      genres: movie.movie_genres.map((mg: any) => mg.genres.name),
      createdAt: new Date(movie.created_at),
      updatedAt: new Date(movie.updated_at)
    }));
  },
  
  // Add a new movie
  async addMovie(movieData: CreateMovieInput): Promise<MovieWithGenres> {
    // Get the authenticated user's ID
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
  
    // First, insert the movie
    const { data: movie, error } = await supabase
      .from("movies")
      .insert({
        user_id: authData.user.id, // ✅ Now it's a string instead of a Promise
        title: movieData.title,
        year: movieData.year,
        director: movieData.director,
        user_rating: movieData.userRating,
        poster_url: movieData.posterUrl,
        watched: movieData.watched,
        watched_date: movieData.watchedDate,
        notes: movieData.notes,
        imdb_id: movieData.imdbId,
      })
      .select()
      .single();
  
    if (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  
    // Handle genres (unchanged)
    const genres = movieData.genre || [];
    if (genres.length > 0) {
      for (const genreName of genres) {
        let { data: existingGenre } = await supabase
          .from("genres")
          .select("id")
          .eq("name", genreName)
          .single();
  
        let genreId;
        if (!existingGenre) {
          const { data: newGenre, error: genreError } = await supabase
            .from("genres")
            .insert({ name: genreName })
            .select()
            .single();
  
          if (genreError) {
            console.error("Error creating genre:", genreError);
            continue;
          }
          genreId = newGenre.id;
        } else {
          genreId = existingGenre.id;
        }
  
        await supabase.from("movie_genres").insert({
          movie_id: movie.id,
          genre_id: genreId,
        });
      }
    }
  
    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      director: movie.director,
      userRating: movie.user_rating,
      posterUrl: movie.poster_url,
      watched: movie.watched,
      watchedDate: movie.watched_date ? new Date(movie.watched_date) : undefined,
      notes: movie.notes,
      imdbId: movie.imdb_id,
      genres: genres,
      createdAt: new Date(movie.created_at),
      updatedAt: new Date(movie.updated_at),
    };
  },
  

  // Update a movie
  async updateMovie(id: string, movieData: Partial<CreateMovieInput>): Promise<void> {
    // Update the movie record
    const { error } = await supabase
      .from('movies')
      .update({
        title: movieData.title,
        year: movieData.year,
        director: movieData.director,
        user_rating: movieData.userRating,
        poster_url: movieData.posterUrl,
        watched: movieData.watched,
        watched_date: movieData.watchedDate,
        notes: movieData.notes,
        imdb_id: movieData.imdbId
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating movie:', error);
      throw error;
    }

    // Handle genres if provided
    if (movieData.genre) {
      // First, get the movie to ensure the user owns it
      const { data: movie } = await supabase
        .from('movies')
        .select('id')
        .eq('id', id)
        .single();

      if (!movie) {
        throw new Error('Movie not found or access denied');
      }

      // Delete existing genre associations
      await supabase
        .from('movie_genres')
        .delete()
        .eq('movie_id', id);

      // Add the new genres
      for (const genreName of movieData.genre) {
        // First check if genre exists
        let { data: existingGenre } = await supabase
          .from('genres')
          .select('id')
          .eq('name', genreName)
          .single();

        let genreId;
        if (!existingGenre) {
          // Create the genre
          const { data: newGenre, error: genreError } = await supabase
            .from('genres')
            .insert({ name: genreName })
            .select()
            .single();

          if (genreError) {
            console.error('Error creating genre:', genreError);
            continue;
          }
          genreId = newGenre.id;
        } else {
          genreId = existingGenre.id;
        }

        // Create the association
        await supabase
          .from('movie_genres')
          .insert({
            movie_id: id,
            genre_id: genreId
          });
      }
    }
  },

  // Delete a movie
  async deleteMovie(id: string): Promise<void> {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  },

  // Import multiple movies
  async importMovies(movies: CreateMovieInput[]): Promise<MovieWithGenres[]> {
    const results: MovieWithGenres[] = [];
    
    // Process each movie one by one
    for (const movie of movies) {
      try {
        const result = await this.addMovie(movie);
        results.push(result);
      } catch (error) {
        console.error(`Error importing movie ${movie.title}:`, error);
        // Continue with the next movie
      }
    }
    
    return results;
  }
};