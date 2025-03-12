import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MoviesPage from './pages/MoviesPage';
import ImportPage from './pages/ImportPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Movie } from './types';
import Footer from './components/layout/Footer';
import SharedMoviesPage from './pages/SharedMoviePage';
import ShareManagementPage from './pages/SharedManagementPage';
import { initGA, logPageView } from  './utils/GoolgeAnaltyics';
import { useClarityTracking } from './utils/ClarityTracking';

const AnalyticsTracker = () => {
  const location = useLocation();
  
  useClarityTracking();
  
  useEffect(() => {
  
    logPageView(location.pathname + location.search);
  }, [location]);
  
  return null; 
};
const AppRoutes = () => {
  const { user, loading, signIn, signOut, signInWithGoogle } = useAuth();
  const [movies, setMovies] = React.useState<Movie[]>([]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isLoggedIn={!!user} onLogout={signOut} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={!!user} />} />
          <Route path="/login" element={
            user ? <Navigate to="/movies" /> : <LoginPage onLogin={signIn} signInWithGoogle={signInWithGoogle} />
          } />
          <Route path="/movies" element={
            user ? (
              <MoviesPage />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/import" element={
            user ? <ImportPage onImportMovies={(importedMovies) => setMovies([...movies, ...importedMovies])} /> : <Navigate to="/login" />
          } />
          <Route path="/shared-with-me" element={
            user ? <SharedMoviesPage /> : <Navigate to="/login" />
          } />
          <Route path="/manage-sharing" element={
            user ? <ShareManagementPage /> : <Navigate to="/login" />
          } />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {

  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AnalyticsTracker /> 
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;