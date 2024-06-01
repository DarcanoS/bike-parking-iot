import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Asegúrate de importar useAuth
import Map from './Map';

function ParkingDetails() {
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [userReservation, setUserReservation] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getParking = async () => {
      const docRef = doc(db, 'parkings', parkingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const parkingData = docSnap.data();
        setParking(parkingData);
        setSpaces(Array.isArray(parkingData.spaces) ? parkingData.spaces : []);
      } else {
        console.log('No such document!');
      }
    };

    const getUserReservation = async () => {
      const q = query(collection(db, 'reservations'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUserReservation(querySnapshot.docs[0].data());
      }
    };

    getParking();
    getUserReservation();
  }, [parkingId, currentUser.uid]);

  const handleReserve = async (spaceId) => {
    if (userReservation) {
      alert('Ya tienes una reserva o un espacio en uso.');
      return;
    }

    try {
      const spaceIndex = spaces.findIndex(space => space.id === spaceId);
      const updatedSpaces = [...spaces];
      updatedSpaces[spaceIndex].status = 'reserved';
      
      await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
      setSpaces(updatedSpaces);

      // Crear una reserva en Firestore
      await addDoc(collection(db, 'reservations'), {
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'reserved',
        timestamp: Date.now(),
      });

      alert('Espacio reservado exitosamente');
      setUserReservation({
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'reserved',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error reservando el espacio: ', error);
    }
  };

  const handleUse = async (spaceId) => {
    if (userReservation) {
      alert('Ya tienes una reserva o un espacio en uso.');
      return;
    }

    try {
      const spaceIndex = spaces.findIndex(space => space.id === spaceId);
      const updatedSpaces = [...spaces];
      updatedSpaces[spaceIndex].status = 'in use';

      await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
      setSpaces(updatedSpaces);

      // Crear una reserva en Firestore
      await addDoc(collection(db, 'reservations'), {
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'in use',
        timestamp: Date.now(),
      });

      alert('Espacio en uso');
      setUserReservation({
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'in use',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error poniendo en uso el espacio: ', error);
    }
  };

  if (!parking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Detalles del Parqueadero</h2>
          <button
            onClick={() => navigate(-1)}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Atrás
          </button>
        </div>
        <div className="mt-6">
          <p><strong>Nombre:</strong> {parking.name}</p>
          <p><strong>Dirección:</strong> {parking.address}</p>
        </div>
        <div className="mt-4">
          <Map latitude={parseFloat(parking.location.latitude)} longitude={parseFloat(parking.location.longitude)} />
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-bold">Espacios de Estacionamiento</h3>
          {spaces.map((space, index) => (
            <div key={space.id} className="mt-4 p-4 border rounded-md bg-white shadow-md">
              <p><strong>Espacio:</strong> {index + 1}</p>
              <p><strong>Estado:</strong> {space.status}</p>
              {space.status === 'available' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleReserve(space.id)}
                    className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Reservar
                  </button>
                  <button
                    onClick={() => handleUse(space.id)}
                    className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Usar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParkingDetails;
