import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function UserReservations() {
  const { currentUser } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const q = query(collection(db, 'reservations'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userReservations = querySnapshot.docs.map(doc => doc.data());
      setReservations(userReservations);
    };

    fetchReservations();
  }, [currentUser.uid]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Mis Reservas</h2>
        {reservations.length === 0 ? (
          <p>No tienes reservas actuales.</p>
        ) : (
          reservations.map(reservation => {
            const timeElapsed = Date.now() - reservation.timestamp;
            const timeLeft = Math.max(0, (reservation.timestamp + reservation.duration - Date.now()) / 1000 / 60); // asumiendo que `duration` está en milisegundos

            return (
              <div key={reservation.spaceId} className="mt-4 p-4 border rounded-md bg-white shadow-md">
                <p><strong>Espacio:</strong> {reservation.spaceId}</p>
                <p><strong>Estado:</strong> {reservation.status}</p>
                {reservation.status === 'reserved' ? (
                  <p><strong>Tiempo restante:</strong> {timeLeft.toFixed(2)} minutos</p>
                ) : (
                  <p><strong>Tiempo en uso:</strong> {(timeElapsed / 1000 / 60).toFixed(2)} minutos</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UserReservations;
