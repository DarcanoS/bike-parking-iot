import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [hasReservations, setHasReservations] = useState(false);

  useEffect(() => {
    const checkReservations = async () => {
      if (currentUser) {
        const reservationsRef = collection(db, 'reservations');
        const q = query(reservationsRef, where('userId', '==', currentUser.uid));
        const reservationsSnap = await getDocs(q);

        setHasReservations(!reservationsSnap.empty);
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
    <nav className="p-4 bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-lg font-bold text-white">
          Bike Parking IoT
        </Link>
        <div>
          {currentUser && (
            <>
              <Link to="/" className="mx-2 text-gray-300 hover:text-white">
                Home
              </Link>
              {currentUser && currentUser.email === 'admin@example.com' ? (
                <>
                  <Link to="/manage-parking" className="mx-2 text-gray-300 hover:text-white">
                    Gestionar Parqueaderos
                  </Link>
                  <Link to="/manage-users" className="mx-2 text-gray-300 hover:text-white">
                    Gestionar Usuarios
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/user-view" className="mx-2 text-gray-300 hover:text-white">
                    Parqueaderos
                  </Link>
                  {hasReservations && (
                    <Link to="/user-reservations" className="mx-2 text-gray-300 hover:text-white">
                      Mis Reservas
                    </Link>
                  )}
                  <Link to="/qr-scanner" className="mx-2 text-gray-300 hover:text-white">
                    Escanear QR
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-2 ml-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <Link to="/signin" className="mx-2 text-gray-300 hover:text-white">
                Iniciar Sesión
              </Link>
              <Link to="/signup" className="mx-2 text-gray-300 hover:text-white">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
