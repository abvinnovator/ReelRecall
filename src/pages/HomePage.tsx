import React from 'react';
import { Link } from 'react-router-dom';

interface HomePageProps {
  isLoggedIn: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoggedIn }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-kabur">
          Never Forget a Movie Again
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track, rate,Share and remember all the movies you've watched in one place.
        </p>
        
        {isLoggedIn ? (
          <Link to="/movies" className="btn-primary text-lg px-8 py-3">
            View My Movies
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            {/* <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Log In
            </Link> */}
          </div>
        )}
      </section>
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Track Movies</h3>
            <p className="text-gray-600">
              Keep a personal log of all the movies you've watched.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Rate & Review</h3>
            <p className="text-gray-600">
              Add your ratings and personal notes to each movie.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#607d8b" d="M36,42H12c-3.309,0-6-2.691-6-6V6h4v30c0,1.103,0.897,2,2,2h24c1.103,0,2-0.897,2-2v-2h4v2 C42,39.309,39.309,42,36,42z"></path><path fill="#2196f3" d="M42 13L33 20 33 6z"></path><path fill="#2196f3" d="M20,32h-4v-9c0-6.617,5.383-12,12-12h7v4h-7c-4.411,0-8,3.589-8,8V32z"></path>
</svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Share</h3>
            <p className="text-gray-600">
             Share your all Movie collections in realtime with ur friends.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">Create an Account</h3>
            <p className="text-gray-600 text-center">
              Sign up in seconds with just your email.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">Add Your Movies</h3>
            <p className="text-gray-600 text-center">
              Add movies individually 
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">Access Anywhere</h3>
            <p className="text-gray-600 text-center">
              Your movie collection is always available on any device.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;