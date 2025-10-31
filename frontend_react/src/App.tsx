import React from 'react';
import Home from './pages/home/Home';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-red-500">
            Welcome to React 18
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Built with TypeScript, Webpack, and TailwindCSS
          </p>
          <Home />
        </div>
      </div>
    </div>
  );
};

export default App;