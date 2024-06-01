import React from 'react';
import { useAuth } from '../components/AuthProvider';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Bienvenido</h2>
          <p className="mt-2 text-center text-gray-600">Usuario: {currentUser?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
