import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

function Navbar() {
  const { currentUser, role } = useAuth();

  return (
    <nav className="bg-indigo-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Parqueadero de Bicicletas IoT</Link>
        <div className="flex space-x-4">
          {currentUser && <Link to="/home">Inicio</Link>}
          {role === 'admin' && <Link to="/admin">Panel de Administración</Link>}
          {role === 'admin' && <Link to="/manage-users">Gestionar Usuarios</Link>}
          {role === 'admin' && <Link to="/manage-parking">Gestionar Parqueaderos</Link>}
          {currentUser && <Link to="/logout">Cerrar Sesión</Link>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
