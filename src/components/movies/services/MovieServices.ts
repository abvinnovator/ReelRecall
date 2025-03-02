import { supabase } from "../../../utils/SupabaseClient";
import { Movie, MovieWithGenres,SharedCollection,ShareCollectionInput } from "../../../types/index"

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
  },
  
  // Share collection with another user by email
  async shareCollection(shareData: ShareCollectionInput): Promise<SharedCollection> {
    // Get the authenticated user's ID (the owner)
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
  
    const ownerId = authData.user.id;
  
    // Fetch user ID using the RPC function
    const { data: sharedUserId, error: userError } = await supabase.rpc("get_user_id_by_email", {
      user_email: shareData.sharedWithEmail,
    });
  
    if (userError || !sharedUserId) {
      throw new Error(`User with email ${shareData.sharedWithEmail} not found`);
    }
  
    // Create the sharing record
    const { data: shareRecord, error: shareError } = await supabase
      .from("shared_collections")
      .insert({
        owner_id: ownerId,
        shared_with_id: sharedUserId,
        permission_level: shareData.permissionLevel,
      })
      .select()
      .single();
  
    if (shareError) {
      if (shareError.code === "23505") {
        throw new Error(`Collection already shared with ${shareData.sharedWithEmail}`);
      }
      console.error("Error sharing collection:", shareError);
      throw shareError;
    }
  
    return {
      id: shareRecord.id,
      ownerId: shareRecord.owner_id,
      sharedWithId: sharedUserId,
      sharedWithEmail: shareData.sharedWithEmail,
      permissionLevel: shareRecord.permission_level as "read" | "edit",
      createdAt: new Date(shareRecord.created_at),
    };
  },
  
  
  // Get all users with whom the collection is shared
  async getSharedUsers(): Promise<SharedCollection[]> {
    // Get the authenticated user's ID (the owner)
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    const ownerId = authData.user.id;
    
    // Get all sharing records where the current user is the owner
    const { data: sharingRecords, error: sharingError } = await supabase
      .from('shared_collections')
      .select(`
        id,
        owner_id,
        shared_with_id,
        permission_level,
        created_at
      `)
      .eq('owner_id', ownerId);
  
    
    if (sharingError) {
      console.error('Error fetching shared users:', sharingError);
      throw sharingError;
    }
    
    // Get the emails for each shared user
    const sharedCollections = await Promise.all(sharingRecords.map(async (record: any) => {
      const { data: email } = await supabase.rpc(
        'get_user_email_by_id', 
        { user_id: record.shared_with_id }
      );
      
      return {
        id: record.id,
        ownerId: record.owner_id,
        sharedWithId: record.shared_with_id,
        sharedWithEmail: email || 'Unknown',
        permissionLevel: record.permission_level,
        createdAt: new Date(record.created_at),
      };
    }));
    
    return sharedCollections;
  },
  
  // Remove sharing for a user
  async removeSharing(sharedWithId: string): Promise<void> {
    // Get the authenticated user's ID (the owner)
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    const ownerId = authData.user.id;
    
    // Delete the sharing record
    const { error: deleteError } = await supabase
      .from('shared_collections')
      .delete()
      .match({ owner_id: ownerId, shared_with_id: sharedWithId });
    
    if (deleteError) {
      console.error('Error removing sharing:', deleteError);
      throw deleteError;
    }
  },
  
  // Get collections shared with the current user
  async getSharedWithMe(): Promise<{
    sharedCollections: SharedCollection[],
    movies: MovieWithGenres[]
  }> {
    // Get the authenticated user's ID
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    const userId = authData.user.id;
    
    // Get all sharing records where the current user is being shared with
    const { data: sharingRecords, error: sharingError } = await supabase
      .from('shared_collections')
      .select('*')
      .eq('shared_with_id', userId);
    
    if (sharingError) {
      console.error('Error fetching collections shared with me:', sharingError);
      throw sharingError;
    }
    
    // Fetch all movies from all owners who shared with the current user
    const ownerIds = sharingRecords.map((record) => record.owner_id);
    
    // Get owner emails using RPC
    const sharedCollections = await Promise.all(sharingRecords.map(async (record) => {
      const { data: ownerEmail } = await supabase.rpc(
        'get_user_email_by_id', 
        { user_id: record.owner_id }
      );
      
      return {
        id: record.id,
        ownerId: record.owner_id,
        ownerEmail: ownerEmail || 'Unknown',
        sharedWithId: record.shared_with_id,
        sharedWithEmail: ownerEmail || 'Unknown',
        permissionLevel: record.permission_level,
        createdAt: new Date(record.created_at)
      };
    }));
    
    // If there are no shared collections, return early
    if (ownerIds.length === 0) {
      return {
        sharedCollections,
        movies: []
      };
    }
    
    // Fetch movies with genres
    const { data: moviesData, error: moviesError } = await supabase
      .from('movies')
      .select(`
        *,
        movie_genres(
          genres(name)
        )
      `)
      .in('user_id', ownerIds)
      .order('watched_date', { ascending: false });
    
    if (moviesError) {
      console.error('Error fetching shared movies:', moviesError);
      throw moviesError;
    }
    
    // Get movie owner emails using RPC
    const processedMovies = await Promise.all(moviesData.map(async (movie) => {
      const { data: ownerEmail } = await supabase.rpc(
        'get_user_email_by_id', 
        { user_id: movie.user_id }
      );
      
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
        ownerEmail: ownerEmail || 'Unknown',
        genres: movie.movie_genres.map((mg: { genres: { name: string } }) => mg.genres.name),
        createdAt: new Date(movie.created_at),
        updatedAt: new Date(movie.updated_at)
      };
    }));
    
    return {
      sharedCollections,
      movies: processedMovies
    };
  },
  
  // Update a shared movie (only if user has edit permission)
  async updateSharedMovie(id: string, movieData: Partial<CreateMovieInput>): Promise<void> {
    // Get the authenticated user's ID
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    const userId = authData.user.id;
    
    // Get the movie to get the owner ID
    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (movieError || !movie) {
      throw new Error('Movie not found');
    }
    
    // Check if the current user has edit permission for this owner's collection
    const { data: permission, error: permissionError } = await supabase
      .from('shared_collections')
      .select('permission_level')
      .eq('owner_id', movie.user_id)
      .eq('shared_with_id', userId)
      .single();
    
    if (permissionError || !permission) {
      throw new Error('You do not have access to this movie');
    }
    
    if (permission.permission_level !== 'edit') {
      throw new Error('You do not have edit permission for this collection');
    }
    
    // Now we can update the movie
    await this.updateMovie(id, movieData);
  }
};
