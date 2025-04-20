import React from 'react';
import { Link } from 'react-router-dom';

interface HomePageProps {
  isLoggedIn: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoggedIn }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Forget <span className="text-primary-600">a Movie Again</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track, rate, and share all the movies you've watched in one beautiful collection.
          </p>
          
          {isLoggedIn ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/movies" 
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View My Collection →
              </Link>
              <Link 
                to="/manage-sharing" 
                className="px-8 py-4 border-2 border-primary-500 text-primary-600 text-lg font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Share Movies
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Journey - It's Free
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 border-2 border-primary-500 text-primary-600 text-lg font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Already a Member?
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 rounded-3xl mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose <span className="text-primary-600">SnapShare</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Comprehensive Tracking</h3>
              <p className="text-gray-600 text-center">
                Log every movie you watch with details like ratings, watch dates, and personal notes.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Smart Recommendations</h3>
              <p className="text-gray-600 text-center">
                Get personalized suggestions based on your viewing history and ratings.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-8 w-8 text-primary-600" viewBox="0 0 48 48">
                  <path fill="#607d8b" d="M36,42H12c-3.309,0-6-2.691-6-6V6h4v30c0,1.103,0.897,2,2,2h24c1.103,0,2-0.897,2-2v-2h4v2 C42,39.309,39.309,42,36,42z"></path>
                  <path fill="#2196f3" d="M42 13L33 20 33 6z"></path>
                  <path fill="#2196f3" d="M20,32h-4v-9c0-6.617,5.383-12,12-12h7v4h-7c-4.411,0-8,3.589-8,8V32z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Seamless Sharing</h3>
              <p className="text-gray-600 text-center">
                Share your movie collections with friends and discover what they're watching.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How <span className="text-primary-600">SnapShare</span> Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Get started in just a few simple steps
          </p>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-4xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Free Account</h3>
                <p className="text-lg text-gray-600">
                  Sign up in seconds with just your email. No credit card required.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-4xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Movie Library</h3>
                <p className="text-lg text-gray-600">
                  Add movies you've watched with ratings, reviews, and personal notes.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-4xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Share & Discover</h3>
                <p className="text-lg text-gray-600">
                  Connect with friends to share your collections and get recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl text-center mb-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Never Forget a Movie Again?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of movie lovers tracking and sharing their cinematic journeys.
          </p>
          {isLoggedIn ? (
            <Link 
              to="/movies" 
              className="inline-block px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Go to My Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="inline-block px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started - It's Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;