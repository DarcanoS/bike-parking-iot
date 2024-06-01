import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const [hasReservation, setHasReservation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkReservations = async () => {
      if (currentUser) {
        const q = query(collection(db, 'reservations'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setHasReservation(true);
        }
      }
    };

    checkReservations();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-white text-lg font-semibold">Home</Link>
        <div className="flex space-x-4">
          {currentUser && (
            <>
              {userRole === 'admin' && (
                <>
                  <Link to="/manage-parking" className="text-white">Gestionar Parqueaderos</Link>
                  <Link to="/manage-users" className="text-white">Gestionar Usuarios</Link>
                </>
              )}
              {userRole === 'user' && (
                <>
                  <Link to="/user-view" className="text-white">Lista de Parqueaderos</Link>
                  {hasReservation && (
                    <Link to="/user-reservations" className="text-white">Mis Reservas</Link>
                  )}
                </>
              )}
              <button onClick={handleLogout} className="text-white">Cerrar Sesión</button>
            </>
          )}
          {!currentUser && (
            <>
              <Link to="/signin" className="text-white">Iniciar Sesión</Link>
              <Link to="/signup" className="text-white">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
