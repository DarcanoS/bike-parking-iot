import React from 'react';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Gestionar Usuarios</h2>
        </div>
        {/* Aquí iría la lógica para gestionar usuarios */}
        <div className="mt-8">
          <p className="text-center">Funcionalidad para gestionar usuarios.</p>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/admin')} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
