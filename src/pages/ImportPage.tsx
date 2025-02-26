import React, { useState, useRef } from 'react';
import { Movie } from '../types';

interface ImportPageProps {
  onImportMovies: (movies: Movie[]) => void;
}

const ImportPage: React.FC<ImportPageProps> = ({ onImportMovies }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importPreview, setImportPreview] = useState<Array<Omit<Movie, 'id'>> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setParseError('');
    setImportPreview(null);
    
    if (selectedFile) {
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // This is a very simple CSV parser that assumes comma separation and that the first row is headers
        const rows = content.split('\n');
        const headers = rows[0].split(',').map(header => header.trim());
        
        // Validate required headers
        if (!headers.includes('title')) {
          throw new Error("CSV must include a 'title' column");
        }
        
        // Parse rows into movie objects
        const parsedMovies: Array<Omit<Movie, 'id'>> = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(',').map(val => val.trim());
          if (values.length !== headers.length) {
            throw new Error(`Row ${i + 1} has incorrect number of columns`);
          }
          
          const movieData: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            movieData[header] = values[index];
          });
          
          // Convert data types appropriately
          const movie: Omit<Movie, 'id'> = {
            title: movieData.title,
            year: movieData.year ? Number(movieData.year) : undefined,
            director: movieData.director || undefined,
            genre: movieData.genre ? movieData.genre.split('|').map((g: string) => g.trim()) : undefined,
            userRating: movieData.rating ? Number(movieData.rating) : 0,
            posterUrl: movieData.posterUrl || undefined,
            watched: true,
            watchedDate: movieData.watchedDate ? new Date(movieData.watchedDate) : new Date(),
            notes: movieData.notes || undefined
          };
          
          parsedMovies.push(movie);
        }
        
        setImportPreview(parsedMovies);
        setParseError('');
      } catch (error: any) {
        setParseError(error.message || 'Failed to parse the file');
        setImportPreview(null);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setParseError('Failed to read the file');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!importPreview) return;
    
    // Convert preview items to full Movie objects with IDs
    const moviesWithIds: Movie[] = importPreview.map(movie => ({
      ...movie,
      id: Date.now() + Math.random().toString(36).substring(2, 9) // Simple unique ID generator
    }));
    
    onImportMovies(moviesWithIds);
    
    // Reset form
    setFile(null);
    setImportPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const headers = 'title,year,director,genre,rating,posterUrl,watchedDate,notes';
    const exampleRow = 'The Matrix,1999,Wachowski Sisters,Sci-Fi|Action,9.0,,2023-02-15,Amazing special effects';
    const csvContent = `${headers}\n${exampleRow}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie_tracker_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Import Movies</h1>
      
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Upload CSV or Excel File</h2>
        
        <div className="mb-6">
          <p className="mb-2 text-gray-600">
            Import your movie collection using a CSV file. The file should have at least a 'title' column, and can include the following columns:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-600">
            <li>title (required): Movie title</li>
            <li>year: Release year</li>
            <li>director: Movie director</li>
            <li>genre: Movie genres, separated by pipe (|) character</li>
            <li>rating: Your rating (1-10)</li>
            <li>posterUrl: URL to the movie poster image</li>
            <li>watchedDate: Date watched (YYYY-MM-DD)</li>
            <li>notes: Your notes or review</li>
          </ul>
          
          <button
            onClick={handleDownloadTemplate}
            className="btn-secondary mb-4"
          >
            Download Template CSV
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-lg h-40 cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-7">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm text-gray-500 mt-2">
                  {file 
                    ? `Selected: ${file.name}`
                    : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400 mt-1">CSV files only</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
        
        {parseError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            <p className="font-bold">Error:</p>
            <p>{parseError}</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="text-center py-4">
            <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Processing file...</p>
          </div>
        )}
        
        {importPreview && importPreview.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Preview ({importPreview.length} movies)</h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-64 overflow-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-100">
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.map((movie, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2 px-3">{movie.title}</td>
                      <td className="py-2 px-3">{movie.year || '—'}</td>
                      <td className="py-2 px-3">{movie.userRating || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              onClick={handleImport}
              className="btn-primary"
            >
              Import {importPreview.length} Movies
            </button>
          </div>
        )}
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Import from Other Services</h2>
        <p className="text-gray-600 mb-4">
          Coming soon: Import your movies from popular services like Letterboxd, IMDb, and more!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md p-4 flex items-center opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-gray-500">L</span>
            </div>
            <span className="text-gray-500">Letterboxd</span>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 flex items-center opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-gray-500">I</span>
            </div>
            <span className="text-gray-500">IMDb</span>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 flex items-center opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-gray-500">T</span>
            </div>
            <span className="text-gray-500">Trakt.tv</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;