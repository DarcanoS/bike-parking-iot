import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import updateSpaceStatus from '../utils/updateSpaceStatus'; // Importar la función

const UserReservations = () => {
  const { currentUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [parkings, setParkings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsRef = collection(db, 'reservations');
      const q = query(reservationsRef, where('userId', '==', currentUser.uid));
      const reservationsSnap = await getDocs(q);

      const reservationsData = [];
      reservationsSnap.forEach((doc) => {
        reservationsData.push({ id: doc.id, ...doc.data() });
      });

      setReservations(reservationsData);
      removeDuplicateReservations(reservationsData);
    };

    fetchReservations();
  }, [currentUser]);

  useEffect(() => {
    const fetchParkings = async () => {
      const parkingsCollection = collection(db, 'parkings');
      const parkingsSnapshot = await getDocs(parkingsCollection);
      const parkingsData = {};
      parkingsSnapshot.forEach((doc) => {
        parkingsData[doc.id] = doc.data();
      });
      setParkings(parkingsData);
    };

    fetchParkings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReservations(prevReservations => [...prevReservations]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const removeDuplicateReservations = async (reservationsData) => {
    const spaceIds = {};
    const duplicates = [];
    
    reservationsData.forEach(reservation => {
      if (spaceIds[reservation.spaceId]) {
        duplicates.push(reservation.id);
      } else {
        spaceIds[reservation.spaceId] = true;
      }
    });

    for (const duplicateId of duplicates) {
      await deleteDoc(doc(db, 'reservations', duplicateId));
    }
    
    setReservations(reservationsData.filter(reservation => !duplicates.includes(reservation.id)));
  };

  const handleCancelReservation = async (reservationId, spaceId, parkingId) => {
    try {
      // Eliminar la reserva de Firestore
      await deleteDoc(doc(db, 'reservations', reservationId));

      // Actualizar el estado del espacio en el parking correspondiente
      const parkingRef = doc(db, 'parkings', parkingId);
      const parkingSnap = await getDoc(parkingRef);
      if (parkingSnap.exists()) {
        const spaces = parkingSnap.data().spaces.map(space => {
          if (space.id === spaceId) {
            return { ...space, status: 'available' };
          }
          return space;
        });

        await updateDoc(parkingRef, { spaces });

        // Llamar a la función updateSpaceStatus con el token y el estado correspondiente
        const space = spaces.find(space => space.id === spaceId);
        await updateSpaceStatus(space.token, 1); // 1 para disponible
      }

      // Actualizar el estado local de las reservas
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error cancelando reserva: ', error);
    }
  };

  const calculateTimeLeft = (timestamp, duration) => {
    const now = Date.now();
    const timeLeft = (timestamp + duration * 60 * 1000) - now;
    return timeLeft > 0 ? Math.ceil(timeLeft / 1000 / 60) : 0;
  };

  const calculateTimeUsed = (timestamp) => {
    const now = Date.now();
    const timeUsed = now - timestamp;
    return Math.ceil(timeUsed / 1000 / 60);
  };

  const calculatePrice = (timeUsed, pricePerMinute) => {
    return timeUsed * pricePerMinute;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900">Mis Reservas</h2>
          <button
            onClick={() => navigate(-1)}
            className="relative flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md group hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Atrás
          </button>
        </div>
        {reservations.length > 0 ? (
          reservations.map((reservation) => {
            const parking = parkings[reservation.parkingId];
            const reservationDuration = parking ? parking.reservationDuration : 0;
            const pricePerMinute = parking ? parking.pricePerMinute : 0;
            const timeLeft = reservation.status === 'reserved' ? calculateTimeLeft(reservation.timestamp, reservationDuration) : 0;
            const timeUsed = reservation.status === 'in use' ? calculateTimeUsed(reservation.timestamp) : 0;
            const price = calculatePrice(timeUsed, pricePerMinute);

            return (
              <div key={reservation.id} className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {reservation.status === 'reserved' ? 'Reserva' : 'En Uso'}
                  </h3>
                  <div className="max-w-2xl mt-1 text-sm text-gray-500">
                    {parking ? parking.name : ''}
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Tiempo restante</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{timeLeft} minutos</dd>
                    </div>
                    <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Tiempo usado</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{timeUsed} minutos</dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Precio</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${price}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex justify-between px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    onClick={() => handleCancelReservation(reservation.id, reservation.spaceId, reservation.parkingId)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No tienes reservas ni espacios en uso</p>
        )}
      </div>
    </div>
  );
};

export default UserReservations;
